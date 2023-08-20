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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axios from "axios";

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function RegisterParcel() {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [fileURL, setfileURL] = useState("");

  // Load images on startup
  useEffect(() => {
    loadImages();
  }, []);

  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

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

  // Save image to file system
  const saveImage = async (uri) => {
    // await ensureDirExists();
    // const filename = new Date().getTime() + ".jpeg";
    // const dest = imgDir + filename;
    // await FileSystem.copyAsync({ from: uri, to: dest });
    setfileURL(uri); //Test function
    setImage(uri);
  };

  // Upload image to google fire storage
  const uploadImage = async (uri) => {
    setUploading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.split("/").pop();

    const storage = getStorage();
    const storageRef = ref(storage, `visitorCarPlate/${filename}`);
    setFileName(storageRef);

    try {
      await uploadBytes(storageRef, blob);
      alert("Image uploaded successfully");
    } catch (e) {
      console.log(e);
    }

    setUploading(false);
  };

  const registerParcel = async (fileURL) => {
    const resultsArray = await detectLabels(fileURL);

    const trackingNumberRegex = /^(SPXMY|MY|SPX|SPE|\d{1})\d{7,14}.$/; // Regular expression to match 12-digit tracking number
    const trackingNumber = resultsArray.find((text) =>
      trackingNumberRegex.test(text)
    );
    console.log(trackingNumber);
  };

  const detectLabels = async (fileURL) => {
    if (!fileURL) {
      alert("No image detected. Please upload or capture an image first.");
      return [];
    }

    const credentials = require("../../../visitor-management-syste-3f0f7-e8395bfdb89d.json");
    const apiKey = credentials.private_key;
    const url = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCxKvcfZcIQy42hjIwbo8jominxkAW6-J0`;

    //Convert latest upload to base64 image for API call
    const base64Data = await FileSystem.readAsStringAsync(fileURL, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Data,
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 10,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(url, requestBody);
      const texts = response.data.responses[0].textAnnotations.map(
        (texts) => texts.description
      );
      return texts;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      {/* <FlatList data={images} renderItem={renderItem} /> */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "500",
            paddingTop: 50,
          }}
        >
          Select or Upload Image of Parcel Label
        </Text>

        {image && (
          <View style={{ flex: 1 }}>
            {image && (
              <Image
                source={{ uri: image }}
                alt="No Image Selected"
                style={{ flex: 1, resizeMode: "contain" }}
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => registerParcel(fileURL)}
      >
        <Text style={styles.buttonText}>Click Me </Text>
      </TouchableOpacity>

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
