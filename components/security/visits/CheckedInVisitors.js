import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../../firebase";

import { useRouter } from "expo-router";

export default CheckedInVisitors = () => {
  const [registeredVisitorsData, setRegisteredVisitorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  fetchData = async () => {
    try {
      const q = query(
        collectionGroup(db, "userRegisteredVisitors"),
        where("isCheckedIn", "==", true),
        where("isCheckedOut", "==", false)
      );

      const unsubscribe = await onSnapshot(
        q,
        (snapshot) => {
          const updatedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            date: new Date(doc.data().visitorVisitDateTime).toLocaleString(),
            entryDateTime: new Date(doc.data().entryTime).toLocaleString(),
            ...doc.data(),
          }));
          setRegisteredVisitorData(updatedData);
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

  const handleShowVisitorLicense = (visitor) => {
    router.push({
      pathname: "/visits/showimage",
      params: {
        imageURL: encodeURIComponent(visitor.driversLicenseImageURL),
        headerTitle: "Visitor's Driver License",
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
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

      {isDataFetched && registeredVisitorsData.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No checked in visitors currently.
          </Text>
          <MaterialCommunityIcons
            name="note-remove-outline"
            size={130}
            color={"black"}
          />
        </View>
      )}

      <FlatList
        style={styles.container}
        data={registeredVisitorsData}
        keyExtractor={(visitor) => visitor.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: visitor }) => (
          <View style={styles.visitorsContainer}>
            <View style={styles.visitorDataContainer}>
              <Text style={styles.dataText}>{visitor.visitorName}</Text>
              <Text style={styles.dataText}>{visitor.visitorIC}</Text>
              <Text style={styles.dataText}>{visitor.visitorCarPlate}</Text>
              <Text style={styles.dataText}>{visitor.visitorTelNo}</Text>
              <Text style={styles.dataText}>{visitor.date}</Text>
              <Text style={styles.dataText}>{visitor.visitorVisitPurpose}</Text>
              <Text style={styles.dataText}>{visitor.visitorVisitingUnit}</Text>

              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingTop: 20,
                  }}
                  onPress={() => handleShowVisitorLicense(visitor)}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "DMBold",
                      color: "green",
                    }}
                  >
                    Visitor Has Checked In
                  </Text>
                  <View>
                    <Feather name="external-link" size={25} color={"green"} />
                  </View>
                </TouchableOpacity>
                <View style={{ paddingTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "DMRegular",
                    }}
                  >
                    Entry Date Time:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: "DMRegular",
                    }}
                  >
                    {visitor.entryDateTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
  },
  visitorsContainer: {
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
  visitorDataContainer: {
    width: "100%",
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
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.2,
    padding: 20,
    gap: 5,
  },
  noDataText: {
    textAlign: "center",
    fontFamily: "DMRegular",
    fontSize: 25,
  },
});
