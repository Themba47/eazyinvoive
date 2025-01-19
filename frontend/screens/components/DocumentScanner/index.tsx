import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions as RNDimensions, ViewStyle, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { detectEdges } from '../../utils';

interface ScreenDimensions {
  width: number;
  height: number;
}

const SCREEN_DIMENSIONS: ScreenDimensions = {
  width: RNDimensions.get('window').width,
  height: RNDimensions.get('window').height,
};

interface DocumentScannerProps {
  onPictureTaken?: (result: ProcessedImage) => void;
  style?: ViewStyle;
}

interface ProcessedImage {
  width: number;
  height: number;
  edges: Uint8Array;
}

interface EdgeDetectionOptions {
  gaussianSigma?: number;
  lowThreshold?: number;
  highThreshold?: number;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onPictureTaken,
  style,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setCameraReady] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const onCameraReady = (): void => {
    setCameraReady(true);
  };

  const takePicture = async (): Promise<void> => {
	console.log("PICTURE TAKEN!!!")
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: true,
        });

        const processedImage = await processImage(photo.uri);

        if (processedImage && onPictureTaken) {
          onPictureTaken(processedImage);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const processImage = async (uri: string): Promise<ProcessedImage | null> => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }],
        { base64: true }
      );

      if (!manipResult.base64) {
        throw new Error('Failed to get base64 image data');
      }

      const imageData = new Uint8Array(
        Buffer.from(manipResult.base64, 'base64')
      );

      const edges = await detectEdges(imageData, manipResult.width, manipResult.height, {
        gaussianSigma: 1.4,
        lowThreshold: 20,
        highThreshold: 40,
      });

      return {
        width: manipResult.width,
        height: manipResult.height,
        edges,
      };
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={[styles.container, style]}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
        onCameraReady={onCameraReady}
      >
        <DocumentFrame />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={!isCameraReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const DocumentFrame: React.FC = () => (
  <View style={styles.documentFrame}>
    <View style={[styles.corner, styles.cornerTL]} />
    <View style={[styles.corner, styles.cornerTR]} />
    <View style={[styles.corner, styles.cornerBL]} />
    <View style={[styles.corner, styles.cornerBR]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButtonInner: {
    backgroundColor: '#030033',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  documentFrame: {
    position: 'absolute',
    top: SCREEN_DIMENSIONS.height * 0.15,
    left: SCREEN_DIMENSIONS.width * 0.1,
    right: SCREEN_DIMENSIONS.width * 0.1,
    bottom: SCREEN_DIMENSIONS.height * 0.15,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
});

export default DocumentScanner;