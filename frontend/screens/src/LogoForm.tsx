import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext'; // Assuming the AuthContext is in a parent component

const LogoForm = () => {
  const [logoUri, setLogoUri] = useState<string | null>(null); // State for storing the logo URI
  const [companyName, setCompanyName] = useState<string>(''); // State for storing the company name
  const { authToken, companyId, userId } = useContext(AuthContext); // Get authToken and companyId from context
  console.log(`${authToken}, ${companyId}, ${userId}`)
  const selectLogo = () => {
    launchImageLibrary(
      {
        mediaType: 'iphoto',
        includeBase64: true, // If you need to send base64 data
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else {
          setLogoUri(response.assets[0].uri); // Set the logo URI
        }
      }
    );
  };

  const uploadLogo = async () => {
    if (!logoUri || !companyName || !companyId || !authToken) {
      console.log('Please fill all fields and select a logo');
      return;
    }

    const formData = new FormData();
    formData.append('company_id', companyId);
    formData.append('company_name', companyName);
    formData.append('logo', {
      uri: logoUri,
      type: 'image/jpeg', // Adjust this based on the image type
      name: 'company_logo.jpg',
    });

    try {
      const response = await axios.post('https://yourapi.com/upload-logo', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Send authToken if needed
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('Logo uploaded successfully');
      } else {
        console.log('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Company Logo</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter company name"
        value={companyName}
        onChangeText={setCompanyName}
      />

      <Button title="Select Logo" onPress={selectLogo} />

      {logoUri && (
        <Image source={{ uri: logoUri }} style={styles.imagePreview} />
      )}

      <Button title="Upload Logo" onPress={uploadLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginBottom: 20,
  },
});

export default LogoForm;
