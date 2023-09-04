import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  collectionGroup,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { db } from "../../../firebase";

const RegisteredVisitsToday = () => {
  const [registeredVisitorsData, setRegisteredVisitorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      fetchData();
    }
  }, [isDataFetched]);

  fetchData = async () => {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today).toISOString();
      const endOfToday = endOfDay(today).toISOString();

      const q = query(
        collectionGroup(db, "userRegisteredVisitors"),
        where("visitorVisitDateTime", ">=", startOfToday),
        where("visitorVisitDateTime", "<=", endOfToday),
        where("isCheckedIn", "==", false),
        orderBy("visitorVisitDateTime", "asc")
      );

      const unsubscribe = await onSnapshot(
        q,
        (snapshot) => {
          const updatedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            date: new Date(doc.data().visitorVisitDateTime).toLocaleString(),
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

      {isDataFetched && registeredVisitorsData.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No registered visitors found for today.
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
              <Text style={styles.dataText}>{visitor.visitorVisitPurpose}</Text>
              <Text style={styles.dataText}>{visitor.visitorVisitingUnit}</Text>

              <View style={{ paddingTop: 20, flexDirection: "column" }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "DMBold",
                    color: "#007AFF",
                  }}
                >
                  Visit Date Time:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "DMBold",
                    color: "#007AFF",
                  }}
                >
                  {visitor.date}
                </Text>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
};

export default RegisteredVisitsToday;

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
