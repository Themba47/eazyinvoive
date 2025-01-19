import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, Platform, Dimensions, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Buffer } from 'buffer';
import { backendApp, getPaperSize } from '../utils';
import { generateInvoicePdf } from '../pdfs/makepdfs';

// Ensure Buffer is globally available
global.Buffer = global.Buffer || Buffer;

export default ({ route, navigation }) => {
  const [pdfPath, setPdfPath] = useState('');
  const [invoice, setInvoice] = useState({})
  const { invoiceId } = route.params;

  const getMyInfo = () => {
    console.log(invoiceId)
  }
  
  
 const getInvoiceData = async () => {
	try {
	  const response = await axios.get(`${backendApp()}/api/invoices/${invoiceId}`)
	  console.log(response.data.myjobs[0])
	  setInvoice(response.data.myjobs[0]);
	} catch (error) {
	  console.error('Error:', error.message)
	}
 };

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
	  } else {
      console.log('File exists');
    }
    
	  // Define the destination path
    const timestamp = new Date().getTime();
	  const downloadPath = `${FileSystem.cacheDirectory}example_${timestamp}.pdf`;
 
	  // Copy the file to the destination
	  await FileSystem.copyAsync({
      from: pdfPath,
      to: downloadPath,
	  });
    
    await Sharing.shareAsync(downloadPath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Save PDF',
      UTI: 'com.adobe.pdf' // for iOS
    });

	  // Save the file to the device's media library
	  // const asset = await MediaLibrary.createAssetAsync(downloadPath);
	  // await MediaLibrary.createAlbumAsync('Download', asset, false);
 
	  // Alert.alert('Success', `PDF saved successfully!`);
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

 useEffect(() => {
	if(invoiceId) {
	getInvoiceData()
	 generateInvoicePdf(setPdfPath, invoiceId)
  }
}, [invoiceId]);

  return (
    <View style={styles.container}>
		<View>
			<Text>{invoice.id}</Text>
		</View>
      {pdfPath ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri: `${pdfPath}` }}
          style={styles.webview}
        />
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave}>
          <Text>Save Locally</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare(pdfPath)}>
          <Text>Send via Whatsapp</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare(pdfPath)}>
          <Text>Send via Email</Text>
        </TouchableOpacity>
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
