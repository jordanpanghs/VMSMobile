import React, { useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Stack, useLocalSearchParams } from "expo-router";

export default function showParcelQRCode() {
  //Retrieve the document id from params passed in from upcomingvisits.js
  const searchParams = useLocalSearchParams();
  const documentID = searchParams.documentID;

  const [productQRref, setProductQRref] = useState();
  const [dataURL, setDataURL] = useState(); //Base64 string of the QR Code image

  const handleShare = async () => {
    const fileName = "qr-code.png";
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      // Write base64 encoding of the image into shareable file
      await FileSystem.writeAsStringAsync(fileUri, dataURL, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get local URL of file
      // const localUrl = await FileSystem.getContentUriAsync(fileUri);

      // Share file
      await Sharing.shareAsync(fileUri, {
        mimeType: "image/png",
        dialogTitle: "Share QR Code",
      });
    } catch (error) {
      console.log("Error sharing QR code: ", error);
    }
  };

  //Convert the QR Code to a base64 string
  const getDataURL = () => {
    if (productQRref) {
      productQRref.toDataURL((dataURL) => {
        setDataURL(dataURL);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: `Parcel QR Code`,
          animation: "slide_from_right",
        }}
      />
      <View style={styles.qrContainer}>
        <Text style={styles.instructionText}>
          Show this to the security guard to claim your parcel
        </Text>
        <QRCode
          value={JSON.stringify(documentID)}
          size={300}
          getRef={(c) => setProductQRref(c)}
        />
        {getDataURL()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "DMBold",
  },
  instructionText: {
    fontFamily: "DMRegular",
    fontSize: 25,
  },
});
