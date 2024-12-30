import React, { useContext, useState } from 'react';
import { View, Button, Image, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../auth/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import axios from 'axios';
import { backendApp } from '../utils';

// Navigation types
type RootStackParamList = {
  LogoUpload: undefined;
  TaxToggleScreen: undefined;
};

type LogoUploadScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LogoUpload'>;
};

interface UploadedImage {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
}

const LogoUploadScreen: React.FC<LogoUploadScreenProps> = ({ route, navigation }) => {
  fetchCsrfToken();
  const { selectedValue } = route.params; // Retrieve selected company type
  console.log(`^^^^^^^^^^^^ ${selectedValue} ^^^^^^^^^^^^^`)
  const { companyId } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const API_URL = `${backendApp()}/api/upload-logo/`; // Replace with your actual API endpoint

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and media library permissions to use this feature.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const validateImage = async (fileUri: string): Promise<boolean> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // Check file size (5MB limit)
      const fileSizeInMB = fileInfo.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        Alert.alert('File Too Large', 'Logo file size must be less than 5MB');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    }
  };

  const handleImageSelection = async (useCamera: boolean = false) => {
    try {
      if (!(await requestPermissions())) {
        return;
      }

      const pickerMethod = useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;

      const result = await pickerMethod({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for logo
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        if (!(await validateImage(asset.uri))) {
          return;
        }

        const fileName = asset.uri.split('/').pop() || 'logo.jpg';
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Allow all image types for now
        if (!type.startsWith('image/')) {
          Alert.alert('Unsupported Format', 'Please select an image file.');
          return;
        }

        const fileInfo = await FileSystem.getInfoAsync(asset.uri);

        setSelectedImage({
          uri: asset.uri,
          fileName,
          type,
          fileSize: fileInfo.size || 0,
        });
      }
    } catch (error) {
      console.error('Error selecting logo:', error);
      Alert.alert('Error', 'Failed to select logo');
    }
  };

  const uploadLogo = async () => {
    console.log("UPLOAD LOGO>>>>>")

    if (!selectedImage) return;

    setUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('logo', {
        uri: selectedImage.uri,
        name: selectedImage.fileName,
        type: selectedImage.type,
      } as any);
      
      formData.append('company_id', companyId)

      // Upload using axios
      console.log(API_URL)
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCsrfToken(),
          // Add any authentication headers here
          // 'Authorization': `Bearer ${your_token}`
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Logo uploaded successfully', [
          {
            text: 'Continue',
          },
        ]);
        navigation.navigate('TaxToggleScreen', {selectedValue});
      }
    } catch (error) {
      console.error('Error uploading logo:', error.response);
      Alert.alert('Upload Failed', 'Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Logo</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Take Photo"
          onPress={() => handleImageSelection(true)}
          disabled={uploading}
        />
        <Button
          title="Choose from Library"
          onPress={() => handleImageSelection(false)}
          disabled={uploading}
        />
      </View>

      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Text style={styles.imageInfo}>
            Size: {(selectedImage.fileSize / (1024 * 1024)).toFixed(2)}MB
          </Text>
          <View style={styles.uploadButton}>
            <Button
              title={uploading ? 'Uploading...' : 'Upload Logo'}
              onPress={uploadLogo}
              disabled={uploading}
            />
          </View>
        </View>
      )}

      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  imagePreview: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imageInfo: {
    marginTop: 8,
    fontSize: 14,
    color: 'gray',
  },
  uploadButton: {
    marginTop: 16,
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogoUploadScreen;
