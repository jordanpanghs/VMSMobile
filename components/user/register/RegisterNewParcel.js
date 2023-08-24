import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useState } from "react";

import { db } from "../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";

import { useAuth } from "../../../context/AuthContext";

function RegisterNewParcel() {
  const [parcelReceiverName, setParcelReceiverName] = useState("");
  const [parcelReceiverTelNo, setParcelReceiverTelNo] = useState("");

  const [parcelTrackingNumber, setParcelTrackingNumber] = useState("");

  const { currentUser, userResidentUnit } = useAuth();

  const addParcel = () => {
    if (
      parcelReceiverName.trim() === "" ||
      parcelReceiverTelNo.trim() === "" ||
      parcelTrackingNumber.trim() === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    const userRegisteredParcelsRef = collection(
      userDocRef,
      "userRegisteredParcels"
    );

    addDoc(userRegisteredParcelsRef, {
      parcelReceiverName: parcelReceiverName,
      parcelReceiverTelNo: parcelReceiverTelNo,
      parcelReceiverUnit: userResidentUnit,
      parcelTrackingNumber: parcelTrackingNumber,
      isClaimed: false,
      hasArrived: false,
    }).then(() => {
      setParcelReceiverName("");
      setParcelReceiverTelNo("");

      setParcelTrackingNumber("");
      alert("Added successfully");
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Receiver Name</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={parcelReceiverName}
            onChangeText={(text) =>
              setParcelReceiverName(
                text.replace(/[^a-zA-Z\s]/g, "").toUpperCase()
              )
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Receiver Phone Number</Text>
          <TextInput
            selectionColor="#007aff"
            keyboardType="numeric"
            style={styles.input}
            value={parcelReceiverTelNo}
            onChangeText={(text) =>
              setParcelReceiverTelNo(text.replace(/[^0-9]/g, "").toUpperCase())
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Parcel Tracking Number</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={parcelTrackingNumber}
            onChangeText={(text) => setParcelTrackingNumber(text.toUpperCase())}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={addParcel}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    height: "auto",
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  dateTimeText: {
    fontFamily: "DMBold",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#cccccc",
    padding: 10,
  },
  dateTimeIcons: {
    flexDirection: "row",
    gap: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "DMRegular",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontFamily: "DMBold",
  },
  buttonContainer: {
    width: "50%",
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
  },
  button: {
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

export default RegisterNewParcel;
