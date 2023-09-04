import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  doc,
  collectionGroup,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import UploadVisitorImage from "./UploadVisitorImage";

import axios from "axios";

import Ionicons from "react-native-vector-icons/Ionicons";

import { useRouter } from "expo-router";

export default ManualCheckOut = () => {
  const [visitorCarPlate, setVisitorCarPlate] = useState("");
  const [visitorFound, setVisitorFound] = useState(false);
  const [visitorData, setVisitorData] = useState([]);
  const [notificationToken, setNotificationToken] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [exitImage, setExitImage] = useState("");

  const router = useRouter();

  const uploadImage = async (uri, imageType) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = visitorData.id;

    const storage = getStorage();
    const storageRef =
      imageType === "licenseImage"
        ? ref(storage, `visitorDriverLicense/${filename}`)
        : imageType === "plateImage"
        ? ref(storage, `visitorCarPlate/${filename}`)
        : imageType === "exitImage"
        ? ref(storage, `visitorExitImage/${filename}`)
        : null;

    try {
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);
      console.log(getDownloadURL(storageRef));
      return imageURL;
    } catch (e) {
      console.log(e);
    }
  };

  async function findVisitor() {
    // setIsLoading(true);
    if (visitorCarPlate.trim() === "") {
      alert("Please fill in the visitor's car plate number!");
      return;
    }

    const q = query(
      collectionGroup(db, "userRegisteredVisitors"),
      where("visitorCarPlate", "==", visitorCarPlate),
      where("isCheckedIn", "==", true),
      where("isCheckedOut", "==", false),
      where("hasVisited", "==", false)
    );

    const querySnapshot = await getDocs(q);
    const newDocData = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        newDocData.parentDocRef = doc.ref.parent.parent;
        newDocData.id = doc.id;
        newDocData.visitorName = doc.data().visitorName;
        newDocData.visitorIC = doc.data().visitorIC;
        newDocData.visitorCarPlate = doc.data().visitorCarPlate;
        newDocData.date = new Date(doc.data().entryTime).toLocaleString();
        newDocData.driversLicenseImageURL = doc.data().driversLicenseImageURL;
      });
      const parentDoc = await getDoc(newDocData.parentDocRef);
      const notificationToken = parentDoc.data().notificationToken;
      setNotificationToken(notificationToken);
      setVisitorData(newDocData);
      setVisitorFound(true);
      return;
    } else {
      alert(
        "Visitor not found. Please enter the correct car plate number. Visitor must be checked in."
      );
      return;
    }
  }

  async function checkOutVisitor() {
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", visitorData.parentDocRef.id);
      const userRegisteredVisitorsRef = collection(
        userDocRef,
        "userRegisteredVisitors"
      );
      const visitorDocRef = doc(userRegisteredVisitorsRef, visitorData.id);

      const exitImageURL = await uploadImage(exitImage, "exitImage");

      updateDoc(visitorDocRef, {
        isCheckedOut: true,
        hasVisited: true,
        exitTime: new Date().toISOString(),
        visitorExitImageURL: exitImageURL,
      }).then(() => {
        sendNotification(
          "Visitor Checked Out!",
          `Visitor ${visitorData.visitorName} has checked out of the residence.`
        );

        setVisitorData("");
        setVisitorFound(false);
        setExitImage("");
        setNotificationToken("");
        setVisitorCarPlate("");
        setIsLoading(false);
        alert("Visitor successfully checked out.");
        router.back();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const sendNotification = async (notificationTitle, notificationMessage) => {
    const message = {
      to: notificationToken,
      title: notificationTitle,
      body: notificationMessage,
    };

    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        JSON.stringify(message),
        {
          headers: {
            host: "exp.host",
            accept: "application/json",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/json",
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Car Plate Number:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorCarPlate}
            onChangeText={(text) => setVisitorCarPlate(text.toUpperCase())}
          />
        </View>

        {visitorFound && (
          <>
            <View style={styles.container}>
              <View style={{ gap: 20 }}>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>Visitor's Name:</Text>
                  <Text style={styles.text}>{visitorData.visitorName}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>Visitor's IC Number:</Text>
                  <Text style={styles.text}>{visitorData.visitorIC}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>
                    Visitor's Car Plate Number:
                  </Text>
                  <Text style={styles.text}>{visitorData.visitorCarPlate}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>
                    Visitor's Entry Date Time:
                  </Text>
                  <Text style={styles.text}>{visitorData.date}</Text>
                </View>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "500",
                    fontFamily: "DMBold",
                  }}
                >
                  Visitor's Driver License:{" "}
                </Text>
                <View style={{ height: 300, width: 300 }}>
                  <Image
                    source={{
                      uri: visitorData.driversLicenseImageURL,
                    }}
                    alt="No Image Selected"
                    style={{
                      flex: 1,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </View>
              <UploadVisitorImage
                detectionType={"exitImage"}
                plateNo={visitorCarPlate}
                setImageLocation={setExitImage}
                setIsLoading={setIsLoading}
              />
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          {!visitorFound ? (
            <TouchableOpacity style={styles.button} onPress={findVisitor}>
              <Text style={styles.buttonText}>Find Visitor</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmationContainer}>
              <View>
                <Text style={styles.confirmationText}>
                  Confirm Check Out Visitor
                </Text>
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
                  onPress={() => checkOutVisitor()}
                >
                  <Ionicons name="checkmark" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
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
  confirmationContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  buttonContainer: {
    justifyContent: "space-evenly",
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
    fontSize: 20,
    fontFamily: "DMBold",
  },
});
