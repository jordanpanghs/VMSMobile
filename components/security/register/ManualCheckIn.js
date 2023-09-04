import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
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

const ManualCheckIn = () => {
  const [visitorName, setVisitorName] = useState("");
  const [visitorIC, setVisitorIC] = useState("");
  const [visitorCarPlate, setVisitorCarPlate] = useState("");
  const [visitorTelNo, setVisitorTelNo] = useState("");
  const [visitorVisitDateTime, setVisitorVisitDateTime] = useState(new Date());
  const [visitorVisitPurpose, setVisitorVisitPurpose] = useState("");
  const [visitingUnit, setVisitingUnit] = useState("");
  const [residentTelNo, setResidentTelNo] = useState("");
  const [residentUserID, setResidentUserID] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentNotificationToken, setResidentNotificationToken] =
    useState("");

  const [residentFound, setResidentFound] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [plateImage, setPlateImage] = useState("");
  const [licenseImage, setLicenseImage] = useState("");

  useEffect(() => {
    if (residentUserID && residentName) {
      console.log("residentUserID: " + residentUserID);
      console.log("residentName: " + residentName);
      addVisitor();
    }
  }, [residentFound]);

  async function findResident() {
    setIsLoading(true);
    if (
      visitorName.trim() === "" ||
      visitorIC.trim() === "" ||
      visitorCarPlate.trim() === "" ||
      visitorTelNo.trim() === "" ||
      visitorVisitPurpose.trim() === "" ||
      visitingUnit.trim() === "" ||
      residentTelNo.trim() === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const q = query(
      collectionGroup(db, "users"),
      where("residentUnit", "==", visitingUnit),
      where("residentTelNo", "==", residentTelNo)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      querySnapshot.forEach(async (doc) => {
        setResidentUserID(doc.id);
        setResidentName(doc.data().residentName);
        setResidentNotificationToken(doc.data().notificationToken);
      });
      setResidentFound(true);
      return;
    } else {
      alert(
        "Resident not found. Please enter the correct resident unit and phone number"
      );
      return;
    }
  }

  async function addVisitor() {
    try {
      const userDocRef = doc(db, "users", residentUserID);

      const userRegisteredVisitorsRef = collection(
        userDocRef,
        "userRegisteredVisitors"
      );

      addDoc(userRegisteredVisitorsRef, {
        //add visitor id according to the number of documents in the collection
        visitorName: visitorName,
        visitorIC: visitorIC,
        visitorCarPlate: visitorCarPlate,
        visitorTelNo: visitorTelNo,
        visitorVisitDateTime: visitorVisitDateTime.toISOString(),
        visitorVisitPurpose: visitorVisitPurpose,
        visitorVisitingUnit: visitingUnit,
        isCheckedIn: true,
        entryTime: new Date().toISOString(),

        isCheckedOut: false,
        exitTime: false,
        hasVisited: false,
      })
        .then(async (docRef) => {
          const uploadImage = async (uri, imageType) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = docRef.id;

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

          const driversLicenseImageURL = await uploadImage(
            licenseImage,
            "licenseImage"
          );

          const carPlateImageURL = await uploadImage(plateImage, "plateImage");

          try {
            const userDocRef = doc(db, "users", residentUserID);

            const userRegisteredVisitorsRef = collection(
              userDocRef,
              "userRegisteredVisitors"
            );
            const visitorDocRef = doc(userRegisteredVisitorsRef, docRef.id);
            await updateDoc(visitorDocRef, {
              driversLicenseImageURL: driversLicenseImageURL,
              carPlateImageURL: carPlateImageURL,
            });
          } catch (error) {
            console.log(error);
          }
        })
        .finally(() => {
          sendNotification(
            "You have a new visitor on the way!",
            `Visit purpose: ${visitorVisitPurpose}`
          );

          setVisitorName("");
          setVisitorIC("");
          setVisitorCarPlate("");
          setVisitorTelNo("");
          setVisitorVisitDateTime("");
          setVisitorVisitPurpose("");
          setVisitingUnit("");
          setResidentTelNo("");
          setIsLoading(false);
          alert("Visitor added successfully under resident " + residentName);
          // router.push("/");
        });
    } catch (error) {
      console.log(error);
    }
  }

  const sendNotification = async (notificationTitle, notificationMessage) => {
    const message = {
      to: residentNotificationToken,
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
          <Text style={styles.label}>Full Name (same as Identity Card):</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorName}
            onChangeText={(text) =>
              setVisitorName(text.replace(/[^a-zA-Z\s]/g, "").toUpperCase())
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Identity Card Number:</Text>
          <TextInput
            keyboardType="numeric"
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorIC}
            onChangeText={(text) => setVisitorIC(text.replace(/[^0-9]/g, ""))}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telephone Number:</Text>
          <TextInput
            keyboardType="numeric"
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorTelNo}
            onChangeText={(text) =>
              setVisitorTelNo(text.replace(/[^0-9]/g, ""))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Date:</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              {visitorVisitDateTime.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Purpose:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorVisitPurpose}
            onChangeText={(text) => setVisitorVisitPurpose(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Unit:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitingUnit}
            onChangeText={(text) => setVisitingUnit(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Resident's Telephone Number:</Text>
          <TextInput
            keyboardType="numeric"
            selectionColor="#007aff"
            style={styles.input}
            value={residentTelNo}
            onChangeText={(text) =>
              setResidentTelNo(text.replace(/[^0-9]/g, ""))
            }
          />
        </View>

        <UploadVisitorImage
          detectionType={"carPlate"}
          plateNo={visitorCarPlate}
          setImageLocation={setPlateImage}
          setIsLoading={setIsLoading}
        />
        <UploadVisitorImage
          detectionType={"driversLicense"}
          name={visitorName}
          icNo={visitorIC}
          setImageLocation={setLicenseImage}
          setIsLoading={setIsLoading}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={findResident}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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

export default ManualCheckIn;

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
