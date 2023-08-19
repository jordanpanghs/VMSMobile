import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { db } from "../../../firebase";
import { doc, updateDoc, collection } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

import Feather from "react-native-vector-icons/Feather";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const EditVisitor = () => {
  const router = useRouter();
  //Initialize the visitor info from the UpcomingVisits.js to hooks
  const params = useLocalSearchParams();
  const [visitorName, setVisitorName] = useState(
    params.visitorName.toUpperCase()
  );
  const [visitorIC, setVisitorIC] = useState(params.visitorIC);
  const [visitorCarPlate, setVisitorCarPlate] = useState(
    params.visitorCarPlate
  );
  const [visitorTelNo, setVisitorTelNo] = useState(params.visitorTelNo);
  const [visitorVisitDateTime, setVisitorVisitDateTime] = useState(
    new Date(params.visitorVisitDateTime)
  );
  const [visitorVisitPurpose, setVisitorVisitPurpose] = useState(
    params.visitorVisitPurpose.toUpperCase()
  );

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    currentDate.setSeconds(0);
    setVisitorVisitDateTime(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleUpdateVisitor = async () => {
    setIsLoading(true);

    const userDocRef = doc(db, "users", currentUser.uid);
    const userRegisteredVisitorsRef = collection(
      userDocRef,
      "userRegisteredVisitors"
    );
    const visitorDocRef = doc(userRegisteredVisitorsRef, params.documentID);

    if (
      visitorName.trim() === "" ||
      visitorIC.trim() === "" ||
      visitorCarPlate.trim() === "" ||
      visitorTelNo.trim() === "" ||
      visitorVisitDateTime.toISOString().trim() === "" ||
      visitorVisitPurpose.trim() === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await updateDoc(visitorDocRef, {
        visitorName: visitorName,
        visitorIC: visitorIC,
        visitorCarPlate: visitorCarPlate,
        visitorTelNo: visitorTelNo,
        visitorVisitDateTime: visitorVisitDateTime.toJSON(),
        visitorVisitPurpose: visitorVisitPurpose,
      });
      alert("Visit updated successfully!");
      router.back();
    } catch (error) {
      console.log(error);
      alert(`Failed to update visit: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerTitle: `Update ${params.visitorName
            .split(" ")
            .shift()}'s Visit Details`,
          animation: "slide_from_bottom",
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name (same as Identity Card):</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorName}
            onChangeText={(text) =>
              setVisitorName(text.replace(/[^a-zA-Z\s]/g, "").toUpperCase())
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Identity Card Number:</Text>
          <TextInput
            keyboardType="numeric"
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorIC}
            onChangeText={(text) => setVisitorIC(text.replace(/[^0-9]/g, ""))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Car Plate Number:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorCarPlate}
            onChangeText={(text) => setVisitorCarPlate(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telephone Number:</Text>
          <TextInput
            keyboardType="numeric"
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorTelNo}
            onChangeText={(text) =>
              setVisitorTelNo(text.replace(/[^0-9]/g, ""))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Date:</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              {visitorVisitDateTime.toLocaleString()}
            </Text>
            <View style={styles.dateTimeIcons}>
              <TouchableOpacity onPress={showDatepicker}>
                <Feather name="calendar" size={30} color={"black"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={showTimepicker}>
                <Feather name="clock" size={30} color={"black"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SafeAreaView>
          {show && (
            <DateTimePicker
              accentColor="#007aff"
              minimumDate={new Date()}
              testID="dateTimePicker"
              value={visitorVisitDateTime}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </SafeAreaView>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Purpose:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorVisitPurpose}
            onChangeText={(text) => setVisitorVisitPurpose(text.toUpperCase())}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateVisitor}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    height: "auto",
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  dateTimeText: {
    fontFamily: "DMBold",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#cccccc",
    padding: 10,
  },
  dateTimeIcons: {
    flexDirection: "row",
    gap: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "DMRegular",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontFamily: "DMBold",
  },
  buttonContainer: {
    width: "50%",
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});

export default EditVisitor;
