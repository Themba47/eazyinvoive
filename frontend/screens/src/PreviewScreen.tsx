import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Alert, Platform, Dimensions, PermissionsAndroid } from 'react-native';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Buffer } from 'buffer';
import { backendApp, getPaperSize } from '../utils';

// Ensure Buffer is globally available
global.Buffer = global.Buffer || Buffer;

export default ({ route, navigation }) => {
  const [pdfPath, setPdfPath] = useState('');
  const { data } = route.params;
  console.log(data)

  useEffect(() => {
	const generatePDF = async () => {
	  try {
		 // Create a new PDF document
		 const pdfDoc = await PDFDocument.create();
		 const papersize = getPaperSize('A4')
		 const page = pdfDoc.addPage(papersize);

		//  page.drawRectangle({
		// 	x: 0,
		// 	y: 0,
		// 	width: papersize[0],
		// 	height: papersize[1],
		// 	color: rgb(0.2, 0.3, 1), // RGB values for light blue
		//  });

		 // Add text to the PDF
		 const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		 page.drawText(`Name: ${data.name}`, { x: 50, y: papersize[1] * .85, size: 16, font, color: rgb(0, 0, 0.8) });
		 page.drawText(`Details: ${data.details}`, { x: 50, y: papersize[1] * .8, size: 12, font, color: rgb(0, 0, 0.6) });

		 // Serialize the PDF to bytes
		 const pdfBytes = await pdfDoc.save();

		 // Convert bytes to base64
		 const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

		 // Save the PDF file using expo-file-system
		 const filePath = `${FileSystem.documentDirectory}example.pdf`;
		 await FileSystem.writeAsStringAsync(filePath, pdfBase64, {
			encoding: FileSystem.EncodingType.Base64,
		 });

		 // Set the path for the generated PDF
		 setPdfPath(filePath);
		 console.log(filePath)
	  } catch (error) {
		 console.error('Error generating PDF:', error);
	  }
	};

	generatePDF();
 }, [data]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save the PDF.',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleSave = async () => {
	try {
	  // Request media library permissions
	  const { status } = await MediaLibrary.requestPermissionsAsync();
	  if (status !== 'granted') {
		 Alert.alert('Permission Denied', 'Cannot save PDF without storage permission.');
		 return;
	  }
 
	  if (!pdfPath) {
		 Alert.alert('Error', 'PDF file is not generated yet.');
		 return;
	  }
 
	  // Define the destination path
	  const downloadPath = `${FileSystem.documentDirectory}example.pdf`;
 
	  // Copy the file to the destination
	  await FileSystem.copyAsync({
		 from: pdfPath,
		 to: downloadPath,
	  });
 
	  // Save the file to the device's media library
	  const asset = await MediaLibrary.createAssetAsync(downloadPath);
	  await MediaLibrary.createAlbumAsync('Download', asset, false);
 
	  Alert.alert('Success', `PDF saved successfully!`);
	} catch (error) {
	  console.error('Error saving PDF:', error);
	  Alert.alert('Error', 'An error occurred while saving the PDF.');
	}
 };

  const handleShare = async (pdfPath: string) => {
	try {
	  if (await Sharing.isAvailableAsync()) {
		 await Sharing.shareAsync(pdfPath);
	  } else {
		 console.log("Sharing is not available on this device.");
	  }
	} catch (error) {
	  console.error("Error sharing the PDF:", error);
	}
 };

  return (
    <View style={styles.container}>
      {pdfPath ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri: `${pdfPath}` }}
          style={styles.webview}
        />
      ) : null}
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Button title="Save Locally" onPress={handleSave} />
        <Button title="Send via WhatsApp" onPress={() => handleShare('whatsapp')} />
        <Button title="Send via Email" onPress={() => handleShare('email')} />
      </View>
    </View>
  );
}

const width = Dimensions.get("window").width; //full width
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
