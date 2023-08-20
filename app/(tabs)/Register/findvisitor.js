import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { collection, getDoc, doc } from "firebase/firestore";

import { db } from "../../../firebase";

export default findVisitor = () => {
  const [visitorData, setVisitorData] = useState([]);

  const params = useLocalSearchParams();
  const data = JSON.parse(params.qrData);
  const userID = data.userID;
  const documentID = data.documentID;

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  fetchData = async () => {
    console.log("hihihi");
    const userDocRef = doc(db, "users", userID);
    const userRegisteredVisitorsRef = collection(
      userDocRef,
      "userRegisteredVisitors"
    );
    const visitorDocRef = doc(userRegisteredVisitorsRef, documentID);

    try {
      const doc = await getDoc(visitorDocRef);
      if (doc.exists()) {
        const docData = doc.data();
        setVisitorData(docData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text> {visitorData.visitorName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
