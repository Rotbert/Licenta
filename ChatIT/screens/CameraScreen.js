import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const cameraRef = useRef();

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      let photo = await cameraRef.current.takePictureAsync(options);

      const source = photo.uri;
      cameraRef.current.pausePreview();
      await handleSave(source);
      cameraRef.current.resumePreview();
    }
  };

  const handleSave = async (photo) => {
    await MediaLibrary.createAssetAsync(photo);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.noPermisionContainer}>
        <Feather name="camera-off" size={154} color="gray" />
        <Text style={styles.mainText}>No access to camera!</Text>
        <Text style={styles.auxText}>
          Camera access permision is turned off.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.preview} type={type} ref={cameraRef}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons name="flip-camera-ios" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.takePictureButton}
        ></TouchableOpacity>
      </Camera>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  flipButton: {
    backgroundColor: "#0782F9",
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  takePictureButton: {
    backgroundColor: "#0782F9",
    width: 55,
    height: 55,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? "12%" : "5%",
  },
  noPermisionContainer: {
    flex: 1,
    marginBottom: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "black",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  auxText: {
    color: "gray",
    fontWeight: "700",
    fontSize: 16,
  },
});
