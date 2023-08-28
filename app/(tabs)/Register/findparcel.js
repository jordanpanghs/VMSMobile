import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
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
  const [icImage, seticImage] = useState("");

  const params = useLocalSearchParams();
  const parcelTrackingNumber = params.qrData;

  const router = useRouter();

  useEffect(() => {
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
        const docData = querySnapshot.docs.map((doc) => ({
          docRef: doc.ref,
          id: doc.id,
          ...doc.data(),
        }));
        setParcelData(docData[0]);
        setDocumentRef(docData[0].docRef);
        setIsLoading(false);
      } else {
        alert("No such document!");
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri) => {
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
      to: "ExponentPushToken[RG11E7Lw8p3gFMtjtp6Q5y]",
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
        const imageURL = await uploadImage(parcelImage);
        await updateDoc(documentRef, {
          hasArrived: true,
          arrivalTime: new Date().toISOString(),
          parcelImageURL: imageURL,
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
          <Text style={styles.textLabel}>{"Parcel Tracking Number"}</Text>
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
            {"Parcel Receiver Resident Unit"}
          </Text>
          <Text style={styles.text}>{parcelData.parcelReceiverUnit}</Text>
        </View>

        {!parcelData.hasArrived && (
          <UploadParcelImage setImageLocation={setParcelImage} />
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
              Confirm Registering Parcel?
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
