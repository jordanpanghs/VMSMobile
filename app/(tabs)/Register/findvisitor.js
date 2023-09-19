import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import axios from "axios";

import UploadVisitorImage from "../../../components/security/register/UploadVisitorImage";

import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import { db } from "../../../firebase";

import Ionicons from "react-native-vector-icons/Ionicons";

export default findVisitor = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [plateImage, setPlateImage] = useState("");
  const [licenseImage, setLicenseImage] = useState("");
  const [exitImage, setExitImage] = useState("");

  const params = useLocalSearchParams();
  const data = JSON.parse(params.qrData);
  const userID = data.userID;
  const documentID = data.documentID;

  const [isEditable, setIsEditable] = useState(false);

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
        const parentDoc = await getDoc(doc.ref.parent.parent);
        const notificationToken = parentDoc.data().notificationToken;
        const residentName = parentDoc.data().residentName;
        const residentTelNo = parentDoc.data().residentTelNo;
        const docData = {
          notificationToken,
          residentName,
          residentTelNo,
          ...doc.data(),
        };
        setVisitorData(docData);
        setIsLoading(false);
      } else {
        alert("No such document!");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri, imageType) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = documentID;

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
      return imageURL;
      console.log(getDownloadURL(storageRef));
    } catch (e) {
      console.log(e);
    }
  };

  const sendNotification = async (notificationTitle, notificationMessage) => {
    const message = {
      to: visitorData.notificationToken,
      title: notificationTitle,
      body: notificationMessage,
      data: { route: "visits" },
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

  handleVisitor = async () => {
    if (visitorData.hasVisited) {
      router.back();
      return alert("Error. Visitation is already completed!");
    }

    setIsLoading(true);
    const userDocRef = doc(db, "users", userID);
    const userRegisteredVisitorsRef = collection(
      userDocRef,
      "userRegisteredVisitors"
    );
    const visitorDocRef = doc(userRegisteredVisitorsRef, documentID);

    //Check in visitor
    if (!visitorData.isCheckedIn && !visitorData.isCheckedOut) {
      try {
        const driversLicenseImageURL = await uploadImage(
          licenseImage,
          "licenseImage"
        );
        const carPlateImageURL = await uploadImage(plateImage, "plateImage");
        await updateDoc(visitorDocRef, {
          visitorName: visitorData.visitorName,
          visitorIC: visitorData.visitorIC,
          visitorCarPlate: visitorData.visitorCarPlate,
          visitorVisitPurpose: visitorData.visitorVisitPurpose,
          isCheckedIn: true,
          entryTime: new Date().toISOString(),
          driversLicenseImageURL: driversLicenseImageURL,
          carPlateImageURL: carPlateImageURL,
        });
        sendNotification(
          "Visitor Checked In!",
          `Visit purpose: ${visitorData.visitorVisitPurpose}`
        );
        setIsLoading(false);
        router.back();
        return alert("Visitor Checked In!");
      } catch (error) {
        console.log(error);
      }
    }

    //Check out visitor
    if (visitorData.isCheckedIn && !visitorData.isCheckedOut) {
      try {
        const exitImageURL = await uploadImage(exitImage, "exitImage");
        await updateDoc(visitorDocRef, {
          hasVisited: true,
          isCheckedOut: true,
          exitTime: new Date().toISOString(),
          visitorExitImageURL: exitImageURL,
        });
        sendNotification(
          "Visitor Checked Out!",
          `Visitor ${visitorData.visitorName} has checked out of the residence.`
        );
        setIsLoading(false);
        router.back();
        return alert("Visitor Checked Out!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerTitle: !visitorData.isCheckedIn
            ? "Check In Visitor"
            : "Check Out Visitor",
        }}
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Visitor's Name:"}</Text>
          {isEditable ? (
            <TextInput
              autoCapitalize="characters"
              style={styles.textInput}
              value={visitorData.visitorName}
              onChangeText={(text) =>
                setVisitorData({
                  ...visitorData,
                  visitorName: text.replace(/[^a-zA-Z\s]/g, "").toUpperCase(),
                })
              }
            />
          ) : (
            <Text style={styles.text}>{visitorData.visitorName}</Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Visitor's IC Number:"}</Text>
          {isEditable ? (
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              value={visitorData.visitorIC}
              onChangeText={(text) =>
                setVisitorData({
                  ...visitorData,
                  visitorIC: text.replace(/[^0-9]/g, ""),
                })
              }
            />
          ) : (
            <Text style={styles.text}>{visitorData.visitorIC}</Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Visitor's Car Plate:"}</Text>
          {isEditable ? (
            <TextInput
              autoCapitalize="characters"
              style={styles.textInput}
              value={visitorData.visitorCarPlate}
              onChangeText={(text) =>
                setVisitorData({
                  ...visitorData,
                  visitorCarPlate: text.toUpperCase(),
                })
              }
            />
          ) : (
            <Text style={styles.text}>{visitorData.visitorCarPlate}</Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Visitor's Visit Purpose:"}</Text>
          {isEditable && !visitorData.isCheckedIn ? (
            <TextInput
              style={styles.textInput}
              value={visitorData.visitorVisitPurpose}
              onChangeText={(text) =>
                setVisitorData({
                  ...visitorData,
                  visitorVisitPurpose: text.toUpperCase(),
                })
              }
            />
          ) : (
            <Text style={styles.text}>{visitorData.visitorVisitPurpose}</Text>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Visiting Unit:"}</Text>
          <Text style={styles.text}>{visitorData.visitorVisitingUnit}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Resident's Name:"}</Text>
          <Text style={styles.text}>{visitorData.residentName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Resident's Telephone Number:"}</Text>
          <Text style={styles.text}>{visitorData.residentTelNo}</Text>
        </View>

        {!visitorData.isCheckedIn && (
          <TouchableOpacity style={styles.buttonContainer}>
            <Text
              onPress={() => setIsEditable(!isEditable)}
              style={{
                backgroundColor: "#007AFF",
                fontFamily: "DMBold",
                fontSize: 20,
                color: "white",
                borderRadius: 5,
                padding: 10,
                alignItems: "center",
              }}
            >
              {isEditable ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        )}

        {/* If visitor is not checked in , render upload car plate , if not render upload exit car image */}
        {!visitorData.isCheckedIn ? (
          <>
            <UploadVisitorImage
              detectionType={"carPlate"}
              plateNo={visitorData.visitorCarPlate}
              setImageLocation={setPlateImage}
              setIsLoading={setIsLoading}
            />
            <UploadVisitorImage
              detectionType={"driversLicense"}
              name={visitorData.visitorName}
              icNo={visitorData.visitorIC}
              setImageLocation={setLicenseImage}
              setIsLoading={setIsLoading}
            />
          </>
        ) : (
          <UploadVisitorImage
            detectionType={"exitImage"}
            plateNo={visitorData.visitorCarPlate}
            setImageLocation={setExitImage}
            setIsLoading={setIsLoading}
          />
        )}

        <View style={styles.confirmationContainer}>
          <View>
            <Text style={styles.confirmationText}>
              {!visitorData.isCheckedIn
                ? "Confirm Check In Visitor"
                : "Confirm Check Out Visitor"}
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
              onPress={() => handleVisitor()}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 20,
  },
  textContainer: {
    flexDirection: "column",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "red",
    textAlignVertical: "center",
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20,
    fontFamily: "DMBold",
    color: "red",
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});
