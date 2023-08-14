import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

function UpcomingVisits() {
  const initialItemState = {
    name: "Sugar",
    expiryDate: "2023-12-31",
    manufacturer: "Kakira Sugar Estate",
  };

  const [item, setItem] = useState(initialItemState);
  const [productQRref, setProductQRref] = useState();
  const [dataURL, setDataURL] = useState(); //Base64 string of the QR Code image

  const handleShare = async () => {
    const fileName = "qr-code.png";
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      // Write base64 string to file
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

  const getDataURL = () => {
    if (productQRref) {
      productQRref.toDataURL(callback);
    }
  };

  const callback = (dataURL) => {
    setDataURL(dataURL);
  };

  return (
    <View style={styles.container}>
      <QRCode
        value={JSON.stringify({
          name: item.name,
          expiry: item.expiryDate,
          manufacturer: item.manufacturer,
        })}
        getRef={(c) => setProductQRref(c)}
      />
      {getDataURL()}
      <Button title="click me" onPress={() => handleShare()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UpcomingVisits;
