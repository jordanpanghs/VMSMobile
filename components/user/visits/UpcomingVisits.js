import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
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

import { useRouter } from "expo-router";

export default function UpcomingVisits() {
  const [registeredVisitorsData, setRegisteredVisitorsData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isDataFetched) {
      setIsLoading(true);
      fetchData();
      setIsDataFetched(true);
      setIsLoading(false);
    }
  }, [isDataFetched]);

  const fetchData = async () => {
    const visitorsRef = collection(db, "registeredVisitors");
    const q = query(visitorsRef);
    const unsubscribe = await onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        date: new Date(doc.data().visitorVisitDateTime).toLocaleString(),
        ...doc.data(),
      }));
      setRegisteredVisitorsData(updatedData);
    });

    return unsubscribe;
  };

  const deleteVisitor = async (visitorName, documentId) => {
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

  const showQR = (visitor) => {
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

      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Edit Visitor</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowEditModal(!showEditModal)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
                <TouchableOpacity onPress={() => showQR(visitor)}>
                  <Ionicons
                    name="qr-code-outline"
                    size={60}
                    color={"#1c1c1e"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity>
                  <Feather name="edit" size={30} color={"#007AFF"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteVisitor(visitor.visitorName, visitor.id)}
                >
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
