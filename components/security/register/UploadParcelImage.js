import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

export default function UploadParcelImage(props) {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");

  // Select image from library or camera
  const selectImage = async (useLibrary) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (uri) => {
    props.setImageLocation(uri);
    setImage(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "500",
            fontFamily: "DMBold",
          }}
        >
          {"Upload or Capture Image of " + props.imageTitle}
        </Text>

        {image && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {image && (
              <Image
                source={{ uri: image }}
                alt="No Image Selected"
                style={{
                  flex: 1,
                  width: 300,
                  height: 300,
                  resizeMode: "center",
                }}
              />
            )}
          </View>
        )}

        {!image && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.2,
            }}
          >
            <MaterialCommunityIcons
              name="image-off-outline"
              size={200}
              color="black"
            />
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => selectImage(true)}
        >
          <Text style={styles.buttonText}>Upload Image </Text>
          <MaterialCommunityIcons
            name="image-multiple"
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => selectImage(false)}
        >
          <Text style={styles.buttonText}>Capture Image </Text>
          <MaterialCommunityIcons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});
