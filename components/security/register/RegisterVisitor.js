import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { set } from "react-native-reanimated";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function RegisterVisitor() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [toggleQRCamera, setToggleQRCamera] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleToggleQRCamera = () => {
    setScanned(false);
    setToggleQRCamera(!toggleQRCamera);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    let dataObj;
    try {
      dataObj = JSON.parse(data);
    } catch (error) {
      console.log(error);
      alert("Invalid QR Code");
      return;
    }

    if (dataObj?.userID === undefined || dataObj?.documentID === undefined) {
      alert("Invalid QR Code");
    }

    router.push({
      pathname: "/register/findvisitor",
      params: {
        qrData: data,
      },
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!toggleQRCamera && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.2,
            height: "80%",
            paddingTop: 50,
          }}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={180} color="black" />
        </View>
      )}

      <View style={styles.qrcameracontainer}>
        {toggleQRCamera && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleToggleQRCamera()}
      >
        <Text style={styles.buttonText}>
          {toggleQRCamera ? "Cancel" : "Scan QR Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  qrcameracontainer: {
    flex: 1,
  },
  button: {
    margin: 20,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});
