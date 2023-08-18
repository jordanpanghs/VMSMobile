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
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

export default function UpcomingVisits() {
  const [registeredVisitorsData, setRegisteredVisitorsData] = useState([]);
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
      const visitorsRef = collection(db, "registeredVisitors");
      const q = query(visitorsRef, where("hasVisited", "==", false));
      const unsubscribe = await onSnapshot(q, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          date: new Date(doc.data().visitorVisitDateTime).toLocaleString(),
          ...doc.data(),
        }));
        setRegisteredVisitorsData(updatedData);
        setIsLoading(false);
        setIsDataFetched(true);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditVisitor = async (visitor) => {
    router.push({
      pathname: "/visits/editvisitor",
      params: {
        documentID: visitor.id,
        visitorName: visitor.visitorName,
        visitorIC: visitor.visitorIC,
        visitorCarPlate: visitor.visitorCarPlate,
        visitorTelNo: visitor.visitorTelNo,
        visitorVisitDateTime: visitor.visitorVisitDateTime,
        visitorVisitPurpose: visitor.visitorVisitPurpose,
      },
    });
  };

  const handleDeleteVisitor = async (visitorName, documentId) => {
    const firstName = visitorName.split(" ").shift();
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${firstName}'s visit?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const docRef = doc(db, "registeredVisitors", documentId);
            await deleteDoc(docRef);
            alert("Visit deleted successfully!");
          },
        },
      ]
    );
  };

  const handleShowQR = (visitor) => {
    router.push({
      pathname: "/visits/qrcode",
      params: {
        documentID: visitor.id,
        visitorName: visitor.visitorName,
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

      {isDataFetched && registeredVisitorsData.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No registered visitors found.</Text>
          <Text style={styles.noDataText}>Register a new one!</Text>
          <MaterialCommunityIcons
            name="note-remove-outline"
            size={130}
            color={"black"}
          />
        </View>
      )}

      {!isLoading && registeredVisitorsData.length > 0 && (
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
                <Text style={styles.dataText}>
                  {visitor.visitorVisitPurpose}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <View style={{ paddingBottom: 10 }}>
                  <TouchableOpacity onPress={() => handleShowQR(visitor)}>
                    <Ionicons
                      name="qr-code-outline"
                      size={60}
                      color={"#1c1c1e"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditVisitor(visitor)}>
                    <Feather name="edit" size={30} color={"#007AFF"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteVisitor(visitor.visitorName, visitor.id)
                    }
                  >
                    <Feather name="trash-2" size={30} color={"red"} />
                  </TouchableOpacity>
                </View>
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
