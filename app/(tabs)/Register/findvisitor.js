import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "../../../firebase";

import Ionicons from "react-native-vector-icons/Ionicons";

export default findVisitor = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams();
  const data = JSON.parse(params.qrData);
  const userID = data.userID;
  const documentID = data.documentID;

  const router = useRouter();

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  fetchData = async () => {
    const userDocRef = doc(db, "users", userID);
    const userRegisteredVisitorsRef = collection(
      userDocRef,
      "userRegisteredVisitors"
    );
    const visitorDocRef = doc(userRegisteredVisitorsRef, documentID);

    try {
      const doc = await getDoc(visitorDocRef);
      if (doc.exists()) {
        const docData = doc.data();
        setVisitorData(docData);
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCheckInVisitor = async () => {
    if (visitorData.isCheckedIn) {
      router.back();
      alert("Visitor has already checked in!");
      return;
    }
    const userDocRef = doc(db, "users", userID);
    const userRegisteredVisitorsRef = collection(
      userDocRef,
      "userRegisteredVisitors"
    );
    const visitorDocRef = doc(userRegisteredVisitorsRef, documentID);

    try {
      await updateDoc(visitorDocRef, {
        isCheckedIn: true,
        entryTime: new Date().toISOString(),
      });
      router.back();
      alert("Visitor Checked In!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textLabel}>{"Visitor's Name:"}</Text>
        <Text style={styles.text}>{visitorData.visitorName}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textLabel}>{"Visitor's IC Number:"}</Text>
        <Text style={styles.text}>{visitorData.visitorIC}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textLabel}>{"Visitor's Car Plate:"}</Text>
        <Text style={styles.text}>{visitorData.visitorCarPlate}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textLabel}>{"Visitor's Visit Purpose:"}</Text>
        <Text style={styles.text}>{visitorData.visitorVisitPurpose}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textLabel}>{"Visitor's Visiting Unit:"}</Text>
        <Text style={styles.text}>{visitorData.visitorVisitingUnit}</Text>
      </View>

      <View style={styles.confirmationContainer}>
        <View>
          <Text style={styles.confirmationText}>Confirm Check In Visitor?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonConfirm}
            onPress={() => handleCheckInVisitor()}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  textContainer: {
    flexDirection: "column",
  },
  text: {
    fontSize: 20,
    fontFamily: "DMRegular",
    color: "#007AFF",
  },
  textLabel: {
    fontSize: 20,
    fontFamily: "DMRegular",
  },
  confirmationContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "space-evenly",
    marginVertical: 20,
    flexDirection: "row",
    gap: 50,
  },
  buttonConfirm: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    gap: 5,
  },
  buttonCancel: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    gap: 5,
  },
  confirmationText: {
    fontSize: 25,
    fontFamily: "DMBold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});
