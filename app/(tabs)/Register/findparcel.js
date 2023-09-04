import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import axios from "axios";

import {
  collection,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import { db } from "../../../firebase";

import Ionicons from "react-native-vector-icons/Ionicons";

import UploadParcelImage from "../../../components/security/register/UploadParcelImage";
import UploadResidentImage from "../../../components/security/register/UploadResidentImage";

export default findParcel = () => {
  const [parcelData, setParcelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [documentRef, setDocumentRef] = useState("");

  const [parcelImage, setParcelImage] = useState("");
  const [parcelLocationImage, setParcelLocationImage] = useState("");
  const [icImage, seticImage] = useState("");

  const params = useLocalSearchParams();
  const parcelTrackingNumber = params.qrData.replace(/"/g, "");

  const router = useRouter();

  useEffect(() => {
    console.log(parcelTrackingNumber);
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  fetchData = async () => {
    try {
      const q = query(
        collectionGroup(db, "userRegisteredParcels"),
        where("parcelTrackingNumber", "==", parcelTrackingNumber)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        const updatedData = [];
        for (const doc of querySnapshot.docs) {
          const parentDoc = await getDoc(doc.ref.parent.parent);
          const data = {
            docRef: doc.ref,
            id: doc.id,
            notificationToken: parentDoc.data().notificationToken,
            ...doc.data(),
          };
          updatedData.push(data);
        }
        setParcelData(updatedData[0]);
        setDocumentRef(updatedData[0].docRef);
        setIsLoading(false);
      } else {
        alert("No such parcel found!");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadParcelImage = async (uri) => {
    setIsLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = documentRef.id;

    const storage = getStorage();
    const storageRef = ref(storage, `visitorParcelLabel/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  const uploadParcelLocationImage = async (uri) => {
    setIsLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = documentRef.id;

    const storage = getStorage();
    const storageRef = ref(storage, `visitorParcelLocation/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  const uploadICImage = async (uri) => {
    setIsLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = documentRef.id;

    const storage = getStorage();
    const storageRef = ref(storage, `parcelRedeemerIC/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  const sendNotification = async (notificationTitle, notificationMessage) => {
    const message = {
      to: parcelData.notificationToken,
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
    } catch (error) {
      console.error(error);
    }
  };

  handleRegisterParcel = async () => {
    if (parcelData.hasArrived && parcelData.isClaimed) {
      router.back();
      alert("Error. Parcel has already been redeemed!");
      return;
    }

    setIsLoading(true);

    if (parcelData.hasArrived) {
      try {
        const imageURL = await uploadICImage(icImage);
        await updateDoc(documentRef, {
          isClaimed: true,
          claimTime: new Date().toISOString(),
          redeemerICImageURL: imageURL,
        });
        await sendNotification(
          "Parcel Redeemed!",
          "Your parcel has been redeemed!"
        );
        setIsLoading(false);
        router.back();
        alert("Parcel Set As Redeemed!");
      } catch (error) {
        console.log(error);
      }
    }

    if (!parcelData.hasArrived) {
      try {
        const parcelLabelImageURL = await uploadParcelImage(parcelImage);
        const parcelLocationImageURL = await uploadParcelLocationImage(
          parcelLocationImage
        );
        await updateDoc(documentRef, {
          hasArrived: true,
          arrivalTime: new Date().toISOString(),
          parcelImageURL: parcelLabelImageURL,
          parcelLocationImageURL: parcelLocationImageURL,
        });
        await sendNotification(
          "Parcel Received!",
          "You have a parcel ready to be redeemed! Head over to the guard house now"
        );
        setIsLoading(false);
        router.back();
        alert("Parcel registered!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerTitle: parcelData.hasArrived
            ? "Redeem Parcel"
            : "Register Parcel",
        }}
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Parcel Tracking Number:"}</Text>
          <Text style={styles.text}>{parcelData.parcelTrackingNumber}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Parcel Receiver Name:"}</Text>
          <Text style={styles.text}>{parcelData.parcelReceiverName}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>{"Parcel Receiver IC Number:"}</Text>
          <Text style={styles.text}>{parcelData.parcelReceiverIC}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>
            {"Parcel Receiver Telephone Number:"}
          </Text>
          <Text style={styles.text}>{parcelData.parcelReceiverTelNo}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>
            {"Parcel Receiver Resident Unit:"}
          </Text>
          <Text style={styles.text}>{parcelData.parcelReceiverUnit}</Text>
        </View>

        {parcelData.hasArrived && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "500",
                fontFamily: "DMBold",
              }}
            >
              Parcel Location:{" "}
            </Text>
            <View style={{ height: 300, width: 300 }}>
              <Image
                source={{
                  uri: parcelData.parcelLocationImageURL,
                }}
                alt="No Image Selected"
                style={{
                  flex: 1,
                  resizeMode: "contain",
                }}
              />
            </View>
          </View>
        )}

        {!parcelData.hasArrived && (
          <>
            <UploadParcelImage
              setImageLocation={setParcelImage}
              imageTitle={"the Parcel Label"}
            />
            <UploadParcelImage
              setImageLocation={setParcelLocationImage}
              imageTitle={"Placed Parcel Location"}
            />
          </>
        )}

        {parcelData.hasArrived && (
          <UploadResidentImage
            name={parcelData.parcelReceiverName}
            icNo={parcelData.parcelReceiverIC}
            setImageLocation={seticImage}
            setIsLoading={setIsLoading}
          />
        )}

        <View style={styles.confirmationContainer}>
          <View>
            <Text style={styles.confirmationText}>
              {!parcelData.hasArrived
                ? "Confirm Registering Parcel?"
                : "Confirm Redeeming Parcel?"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            {!parcelData.hasArrived && (
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleRegisterParcel()}
              >
                <Ionicons name="checkmark" size={24} color="white" />
              </TouchableOpacity>
            )}
            {parcelData.hasArrived && (
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => handleRegisterParcel()}
              >
                <Ionicons name="checkmark" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
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
