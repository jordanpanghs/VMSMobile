import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";

import { db } from "../../../firebase";

export default CheckedInVisitors = () => {
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

    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
  };

  return (
    <View>
      <FlatList
        style={styles.container}
        data={registeredVisitorsData}
        keyExtractor={(visitor) => visitor.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: visitor }) => (
          <TouchableOpacity style={styles.visitorsContainer}>
            <View style={styles.visitorDataContainer}>
              <Text style={styles.dataText}>{visitor.visitorName}</Text>
              <Text style={styles.dataText}>{visitor.visitorIC}</Text>
              <Text style={styles.dataText}>{visitor.visitorCarPlate}</Text>
              <Text style={styles.dataText}>{visitor.visitorTelNo}</Text>
              <Text style={styles.dataText}>{visitor.date}</Text>
              <Text style={styles.dataText}>{visitor.visitorVisitPurpose}</Text>
              <Text style={styles.dataText}>{visitor.visitorVisitingUnit}</Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
              }}
            ></View>
          </TouchableOpacity>
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
  noDataText: {
    fontFamily: "DMRegular",
    fontSize: 25,
  },
});
