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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";

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

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
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
    await ensureDirExists();
    const filename = new Date().getTime() + ".jpeg";
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setfileURL(dest);
    setImages([...images, dest]);
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

  // Delete image from file system
  const deleteImage = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  const detectLabels = async (fileURL) => {
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
      console.log(texts);
      return texts;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Render image list item
  function renderItem({ item }) {
    const filename = item.split("/").pop();
    return (
      <View
        style={{
          flexDirection: "row",
          margin: 1,
          alignItems: "center",
          gap: 5,
        }}
      >
        <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
        <Text style={{ flex: 1 }}>{filename}</Text>
        <Ionicons.Button
          name="cloud-upload"
          onPress={() => uploadImage(item)}
        />
        <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >
        <Button title="Photo Library" onPress={() => selectImage(true)} />
        <Button title="Capture Image" onPress={() => selectImage(false)} />
        <Button title="Click me" onPress={() => detectLabels(fileURL)}></Button>
      </View>

      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>
        My Images
      </Text>
      <FlatList data={images} renderItem={renderItem} />

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
