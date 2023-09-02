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
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../../firebase";
import { useRouter } from "expo-router";

export default function UnclaimedParcels() {
  const [registeredParcelsData, setRegisteredParcelsData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  const fetchData = async () => {
    try {
      const q = query(
        collectionGroup(db, "userRegisteredParcels"),
        where("hasArrived", "==", true),
        where("isClaimed", "==", false)
      );

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
      setIsLoading(false);
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowParcelImage = (parcel) => {
    router.push({
      pathname: "/parcels/showimage",
      params: {
        imageURL: encodeURIComponent(parcel.parcelImageURL),
        headerTitle: "Unclaimed Parcel Image",
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
          <Text style={styles.noParcelText}>No unclaimed parcels found.</Text>
          <Text style={styles.noParcelText}>Register a new one!</Text>
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
                <Text style={styles.dataText}>{parcel.parcelReceiverIC}</Text>
                <Text style={styles.dataText}>{parcel.parcelReceiverUnit}</Text>
                <Text style={styles.dataText}>
                  {parcel.parcelReceiverTelNo}
                </Text>
                <Text style={styles.dataText}>
                  {parcel.parcelTrackingNumber}
                </Text>
                <View>
                  <TouchableOpacity
                    style={styles.parcelStatusContainer}
                    onPress={() => handleShowParcelImage(parcel)}
                  >
                    <Text style={[styles.parcelStatus]}>Show Parcel Image</Text>
                    <View>
                      <Feather
                        name="external-link"
                        size={25}
                        color={"#007AFF"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 20,
                }}
              ></View>
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
  parcelStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 20,
  },
  parcelStatus: {
    fontSize: 15,
    fontFamily: "DMBold",
    color: "#007AFF",
  },
});
