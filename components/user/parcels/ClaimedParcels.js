import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";

export default function ClaimedParcels() {
  const [registeredParcelsData, setRegisteredParcelsData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  const fetchData = async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userRegisteredParcelsRef = collection(
        userDocRef,
        "userRegisteredParcels"
      );
      const q = query(userRegisteredParcelsRef, where("isClaimed", "==", true));
      const unsubscribe = await onSnapshot(
        q,
        (snapshot) => {
          const updatedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRegisteredParcelsData(updatedData);
          setIsLoading(false);
          setIsDataFetched(true);
        },
        (error) => {
          console.log(error);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditParcel = async (parcel) => {
    router.push({
      pathname: "/parcels/editparcel",
      params: {
        documentID: parcel.id,
        parcelReceiverName: parcel.parcelReceiverName,
        parcelReceiverTelNo: parcel.parcelReceiverTelNo,
        parcelTrackingNumber: parcel.parcelTrackingNumber,
        parcelReceiverUnit: parcel.parcelReceiverUnit,
      },
    });
  };

  const handleDeleteParcel = async (documentId) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this parcel?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const docRef = doc(db, "registeredParcels", documentId);
            await deleteDoc(docRef);
            alert("Parcel deleted successfully!");
          },
        },
      ]
    );
  };

  const handleShowQR = (parcel) => {
    router.push({
      pathname: "/parcels/qrcode",
      params: {
        documentID: parcel.id,
      },
    });
  };

  return (
    <View style={{ flex: 1, flexGrow: 1 }}>
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

      {isDataFetched && registeredParcelsData.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noParcelText}>No claimed parcels found.</Text>
          <MaterialCommunityIcons
            name="archive-off-outline"
            size={130}
            color={"black"}
          />
        </View>
      )}

      {!isLoading && registeredParcelsData.length > 0 && (
        <FlatList
          style={styles.container}
          data={registeredParcelsData}
          keyExtractor={(parcel) => parcel.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item: parcel }) => (
            <View style={styles.parcelsContainer}>
              <View style={styles.parcelDataContainer}>
                <Text style={styles.dataText}>{parcel.parcelReceiverName}</Text>
                <Text style={styles.dataText}>
                  {parcel.parcelReceiverTelNo}
                </Text>
                <Text style={styles.dataText}>{parcel.parcelReceiverUnit}</Text>
                <Text style={styles.dataText}>
                  {parcel.parcelTrackingNumber}
                </Text>
                <Text>Claimed by Jordan on 18/8/2023</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
  },
  parcelsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
  },
  parcelDataContainer: {
    padding: 20,
  },
  dataText: {
    fontFamily: "DMRegular",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  noDataContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.2,
    padding: 20,
    gap: 5,
  },
  noParcelText: {
    fontFamily: "DMRegular",
    fontSize: 25,
  },
});
