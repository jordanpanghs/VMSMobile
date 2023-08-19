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
import { doc, updateDoc, collection } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const EditVisitor = () => {
  const router = useRouter();
  //Initialize the visitor info from the UpcomingVisits.js to hooks
  const params = useLocalSearchParams();

  const [parcelReceiverName, setParcelReceiverName] = useState(
    params.parcelReceiverName
  );
  const [parcelReceiverTelNo, setParcelReceiverTelNo] = useState(
    params.parcelReceiverTelNo
  );
  const [parcelTrackingNumber, setParcelTrackingNumber] = useState(
    params.parcelTrackingNumber
  );
  const [parcelReceiverUnit, setParcelReceiverUnit] = useState(
    params.parcelReceiverUnit
  );

  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const handleUpdateParcel = async () => {
    setIsLoading(true);

    if (
      parcelReceiverName.trim() === "" ||
      parcelReceiverTelNo.trim() === "" ||
      parcelTrackingNumber.trim() === "" ||
      parcelReceiverUnit.trim() === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userRegisteredParcelsRef = collection(
        userDocRef,
        "userRegisteredParcels"
      );
      const parcelDocRef = doc(userRegisteredParcelsRef, params.documentID);

      await updateDoc(parcelDocRef, {
        parcelReceiverName: parcelReceiverName,
        parcelReceiverTelNo: parcelReceiverTelNo,
        parcelTrackingNumber: parcelTrackingNumber,
        parcelReceiverUnit: parcelReceiverUnit,
      });
      alert("Parcel updated successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      alert(`Failed to update parcel: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerTitle: "Edit Parcel Info",
          animation: "slide_from_bottom",
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Receiver Name</Text>
          <TextInput
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
            selectionColor="#007aff"
            style={styles.input}
            value={parcelTrackingNumber}
            onChangeText={(text) => setParcelTrackingNumber(text.toUpperCase())}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Receiver Unit</Text>
          <TextInput
            selectionColor="#007aff"
            style={styles.input}
            value={parcelReceiverUnit}
            onChangeText={(text) => setParcelReceiverUnit(text.toUpperCase())}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateParcel}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    height: "auto",
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 15,
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

export default EditVisitor;
