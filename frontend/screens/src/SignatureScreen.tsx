import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Button, Dimensions, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { backendApp } from '../utils';
import Toast from 'react-native-toast-message';

export default () => {
  const { authToken } = useContext(AuthContext);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const canvasWidth = Dimensions.get('window').width;
  const canvasHeight = Dimensions.get('window').height * 0.8;

  useEffect(() => {
    fetchSignature();
    console.log(">>>>")
    console.log(signatureUrl)
  }, []);

  const fetchSignature = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/signature/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.signature) {
        setSignatureUrl(response.data.signature);
      } else {
        setSignatureUrl(null);
      }
    } catch (error) {
      console.error("Error fetching signature:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickSave = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.saveSignature(); true;`);
    }
  };

  const handleSave = (base64Signature: string) => {
    uploadSignature(base64Signature);
  };

  const uploadSignature = async (base64Signature: string) => {
    try {
      await fetchCsrfToken();
      const response = await axios.post(
        `${backendApp()}/api/signature/`,
        { signature: base64Signature },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'X-CSRFToken': getCsrfToken(),
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Signature Saved!',
      });

      fetchSignature(); // Refresh signature after saving
    } catch (e) {
      console.error(e.response?.data || e.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload signature.',
      });
    }
  };

  const handleClear = () => {
    setSignatureUrl(null);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`window.clearSignature(); true;`);
    }
  };

  const signatureHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      canvas {
        border: 1px solid #000;
        touch-action: none;
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
      canvas.height = window.innerHeight * 0.9;

      function getTouchPos(canvas, touchEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: touchEvent.touches[0].clientX - rect.left,
          y: touchEvent.touches[0].clientY - rect.top
        };
      }

      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getTouchPos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.lineWidth = 4;
      });

      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
        ctx.closePath();
      });

      function saveSignature() {
        const dataUrl = canvas.toDataURL();
        window.ReactNativeWebView.postMessage(dataUrl);
      }

      function clearSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    </script>
  </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : signatureUrl ? (
        <Image source={{ uri: signatureUrl }} style={styles.signatureImage} />
      ) : (
        
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: signatureHtml }}
          onMessage={(event) => handleSave(event.nativeEvent.data)}
          style={styles.webview}
        />
      )}
      {!signatureUrl ? (
      <View>
        <Button title="Clear Signature" onPress={handleClear} />
        <Button title="Save Signature" onPress={handleClickSave} />
      </View>) :
      (<View>
        <Button title="Delete Signature" onPress={handleClear} />
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    width: '100%',
    height: '80%',
  },
  signatureImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
});
