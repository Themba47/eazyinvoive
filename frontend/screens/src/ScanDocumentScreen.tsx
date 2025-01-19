// src/screens/ScannerScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DocumentScanner } from '../components/DocumentScanner';
import type { ProcessedImage } from '../components/DocumentScanner/types';
import { WebView } from 'react-native-webview';

export default () => {
	const LICENSE_KEY = "Sif0b2uHpEEDVXvrGnIDRliYWUVAtN" + "Xd/+KxKtazrLkBpv6Q+8N6bhPcOBVM" + "fxsZeV0e+lRqzLBy/rQ/1McE91EOnu" + "FGZHIXdEbVIjPVCgAamDfC/aT8BWWQ" + "hefXNGTsLlQJwuOUcIFMkZ0YnAH3Zm" + "8TqtSNOUFaBufONElBiQvH7s8MsJ1f" + "ppdKu7B0hta3EJ22Mx/3oMg4P9FarO" + "NHqzyR/Jtpq96180kH+ynbFa7bXBf6" + "WtUGr7qPJwMKI5b0s6LmCSjicTK8g6" + "AUnEaCXR58BwdssZOtp+TDa7SE8J9f" + "KOpYhuGPQ2Cthfgt5RWUA3HcH6iVKz" + "aDo0QeO6VLVw==\nU2NhbmJvdFNESw" + "psb2NhbGhvc3R8d3d3LmVhenlpbnZv" + "aWNlLmNvbQoxNzM3OTM1OTk5CjgzOD" + "g2MDcKOA==\n";  // Pass the license key to the Scanbot SDK to initialize it. // Please refer to the corresponding setup guide in our documentation: // https://docs.scanbot.io

  const handleScannedDocument = (result: ProcessedImage) => {
    // Handle the scanned document
	 console.log('Processed image:', result);
  };

  return (
	<View style={styles.container}>
	  <WebView 
		 source={{ uri: 'https://your-web-scanner-url.com' }} 
		 style={{ flex: 1 }}
		 javaScriptEnabled={true}
		 domStorageEnabled={true}
		 startInLoadingState={true}
	  />
	</View>
 );
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	},
 });