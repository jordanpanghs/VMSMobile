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
import * as FileSystem from "expo-file-system";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import axios from "axios";

const imgDir = FileSystem.documentDirectory + "images/";

export default function UploadVisitorImage(props) {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [fileURL, setfileURL] = useState("");

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
    props.setImageLocation(uri);
    setfileURL(uri); //Test function
    setImage(uri);
  };

  const checkIfDataMatches = async (fileURL) => {
    props.setIsLoading(true);
    const resultsArray = await detectLabels(fileURL);
    const str = resultsArray[0];

    console.log(str);

    if (props.detectionType === "driversLicense") {
      //Remove all whitespace from passed in value and recognized texts from API
      //and compare with the plate number registered by the resident
      let name = props.name.replace(/\s/g, "");
      const isNameMatch = str.replace(/\s/g, "").includes(name);

      let icNo = props.icNo.replace(/\s/g, "");
      const isICNoMatch = str.replace(/\s/g, "").includes(icNo);

      if (isNameMatch && isICNoMatch) {
        Alert.alert(
          "Success!",
          "Both visitor name and ic number matches with registered data!"
        );
        props.setIsLoading(false);
      } else if (isNameMatch && !isICNoMatch) {
        Alert.alert(
          "Partial Success",
          "Visitor's name matches but IC number does not match with registered data!"
        );
        props.setIsLoading(false);
      } else if (!isNameMatch && isICNoMatch) {
        Alert.alert(
          "Partial Success",
          "Visitor's IC number matches but name does not match with registered data!"
        );
        props.setIsLoading(false);
      } else {
        Alert.alert(
          "Failed!",
          "Both visitor name and ic number does not match with registered data!"
        );
        props.setIsLoading(false);
      }
    }

    if (props.detectionType === "carPlate") {
      let plateNo = props.plateNo;
      //Remove all whitespace from all combined recognized texts from API
      //and compare with the plate number registered by the resident
      const isCarPlateMatch = str.replace(/\s/g, "").includes(plateNo);

      if (isCarPlateMatch) {
        Alert.alert(
          "Success!",
          "Car license plate matches with registered data!"
        );
        props.setIsLoading(false);
      } else {
        Alert.alert(
          "Failed!",
          "Car license plate does not match with registered data!"
        );
        props.setIsLoading(false);
      }
    }
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
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "500",
            fontFamily: "DMBold",
            paddingTop: 30,
          }}
        >
          Upload or Capture Image of{" "}
          {props.detectionType === "driversLicense"
            ? "Visitor's Driver's License"
            : props.detectionType === "carPlate"
            ? "Visitor's Car Plate Number"
            : "Error. Detection Type Not Specified"}
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => checkIfDataMatches(fileURL)}
      >
        <Text style={styles.buttonText}>Check for match</Text>
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
