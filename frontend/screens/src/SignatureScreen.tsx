import React, { useState, useRef } from 'react';
import { View, Button, Dimensions, Text, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default () => {
  const [signature, setSignature] = useState<string | null>(null);
  const canvasWidth = Dimensions.get('window').width;
  const canvasHeight = Dimensions.get('window').height * .8;
  const webViewRef = useRef(null);

  // Handle the received base64 signature from WebView
  const handleSave = (base64Signature: string) => {
    setSignature(base64Signature);
    Alert.alert('Signature Saved!', 'Your signature has been saved.');
  };

  // Handle clearing the signature
  const handleClear = () => {
    setSignature(null);
	 if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.clearSignature(); true;`);
    }
  };

  // The HTML and JavaScript for the signature pad inside the WebView
  const signatureHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      canvas {
        border: 1px solid #000;
        touch-action: none; /* Prevent touch gestures like scrolling */
      }
      body {
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      button {
        margin-top: 10px;
        padding: 10px 20px;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <canvas id="signature-pad" width="${canvasWidth}" height="${canvasHeight}"></canvas>
    <button onclick="saveSignature()">Save</button>
    <button onclick="clearSignature()">Clear</button>
    <script>
      const canvas = document.getElementById('signature-pad');
      const ctx = canvas.getContext('2d');
      let isDrawing = false;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight * .9;

      // Get touch position
      function getTouchPos(canvas, touchEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top
        };
      }

      // Start drawing
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getTouchPos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      });

      // Draw on the canvas
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
		  ctx.lineWidth = 2;
      });

      // Stop drawing
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
        ctx.closePath();
      });

      // Save the signature as a base64 string
      function saveSignature() {
        const dataUrl = canvas.toDataURL();
        window.ReactNativeWebView.postMessage(dataUrl);
      }

      // Clear the canvas
      function clearSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    </script>
  </body>
  </html>
`;

  return (
    <View style={styles.container}>
      <WebView
		  ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: signatureHtml }}
        onMessage={(event) => handleSave(event.nativeEvent.data)}  // Handle message from WebView
		  style={styles.webview}
      />
      <Button title="Clear Signature" onPress={handleClear} />
      {signature && (
        <View style={{ marginTop: 20 }}>
          <Text>Signature Saved:</Text>
          <Text>{signature}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
	 flex: 1,
  },
  webview: {
	 flex: 1,
	 margin: 20,
	 backgroundColor: 'transparent',
	 borderRadius: 20,
  },
  buttonContainer: {
	 flexDirection: 'row',
	 flexWrap: 'wrap',
	 justifyContent: 'space-between',
	 margin: 10,
  },
});

