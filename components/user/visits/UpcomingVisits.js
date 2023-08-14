import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
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
import { db } from "../../../firebase";

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
    // const querySnapshot = await getDocs(q);
    // const visitorsData = querySnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
    // setVisitors(visitorsData);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRegisteredVisitorsData(updatedData);
    });
    return unsubscribe;
  };

  return (
    <ScrollView style={{ flex: 1, gap: 10 }}>
      {registeredVisitorsData.map((visitor) => (
        <View key={visitor.id} style={{ marginTop: 20 }}>
          <Text>{visitor.visitorName}</Text>
          <Text>{visitor.visitorIC}</Text>
          <Text>{visitor.visitorCarPlate}</Text>
          <Text>{visitor.visitorTelNo}</Text>
          <Text>{visitor.visitorVisitDateTime}</Text>
          <Text>{visitor.visitorVisitPurpose}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default UpcomingVisits;
