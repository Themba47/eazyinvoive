import React, { useState, useRef, useContext } from 'react';
import { View, Button, Dimensions, Text, Alert, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { baseStyles } from '../stylesheet';
import { backendApp } from '../utils';
import axios from 'axios';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { AuthContext } from '../auth/AuthContext';
import Toast from 'react-native-toast-message';

export default () => {
  const { authToken, userId } = useContext(AuthContext);
  const [signature, setSignature] = useState<string | null>(null);
  const canvasWidth = Dimensions.get('window').width;
  const canvasHeight = Dimensions.get('window').height * .8;
  const webViewRef = useRef(null);

  const handleClickSave = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.saveSignature(); true;`);
    }
  }
  

  // Handle the received base64 signature from WebView
  const handleSave = (base64Signature: string) => {
    setSignature(base64Signature);
    Alert.alert('Signature Saved!', 'Your signature has been saved.');
  };

  const uploadSignature = async () => {
    try {
      await fetchCsrfToken();
      const response = await axios.post(`${backendApp()}/api/auth/login/`, {
        body: JSON.stringify({ signature: signature }),
      },
      {
        headers: {
            Authorization: `Bearer ${authToken}`, 
            'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true, // Ensures cookies are sent with the request
    });

      // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Signature Saved!',
    });
    } catch (e) {
      console.error(e.response?.data || e.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload signature.',
      });
    }
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
		  ctx.lineWidth = 4;
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
    <View style={baseStyles.container}>
      <WebView
		  ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: signatureHtml }}
        onMessage={(event) => handleSave(event.nativeEvent.data)}  // Handle message from WebView
		  style={styles.webview}
      />
      <Button title="Clear Signature" onPress={handleClear} />
      <Button title="Save Signature" onPress={handleClickSave} />
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

