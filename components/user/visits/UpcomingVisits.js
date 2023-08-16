import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../firebase";
import { SafeAreaView } from "react-native-safe-area-context";

function UpcomingVisits() {
  const [registeredVisitorsData, setRegisteredVisitorsData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      fetchData();
      setIsDataFetched(true);
    }
  }, [isDataFetched]);

  const fetchData = async () => {
    const visitorsRef = collection(db, "registeredVisitors");
    const q = query(visitorsRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        date: new Date(doc.data().visitorVisitDateTime).toLocaleString(),
        ...doc.data(),
      }));
      setRegisteredVisitorsData(updatedData);
    });
    return unsubscribe;
  };

  return (
    <View style={{ flex: 1, flexGrow: 1 }}>
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
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
              }}
            >
              <View style={{ paddingBottom: 10 }}>
                <TouchableOpacity>
                  <Ionicons
                    name="qr-code-outline"
                    size={60}
                    color={"#1c1c1e"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={(visitor) => showQR(visitor)}>
                  <Feather name="edit" size={30} color={"#007AFF"} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="trash-2" size={30} color={"red"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
}

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
});

export default UpcomingVisits;
