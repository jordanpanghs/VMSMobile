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
import { collection, addDoc } from "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";

const RegisterNewVisitor = () => {
  const [visitorName, setVisitorName] = useState("");
  const [visitorIC, setVisitorIC] = useState("");
  const [visitorCarPlate, setVisitorCarPlate] = useState("");
  const [visitorTelNo, setVisitorTelNo] = useState("");
  const [visitorVisitDateTime, setVisitorVisitDateTime] = useState(new Date());
  const [visitorVisitPurpose, setVisitorVisitPurpose] = useState("");

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

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

  const addVisitor = () => {
    if (
      visitorName.trim() === "" ||
      visitorIC.trim() === "" ||
      visitorCarPlate.trim() === "" ||
      visitorTelNo.trim() === "" ||
      visitorVisitDateTime.trim() === "" ||
      visitorVisitPurpose.trim() === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const dbInstance = collection(db, "registeredVisitors");
    addDoc(dbInstance, {
      //add visitor id according to the number of documents in the collection
      visitorName: visitorName,
      visitorIC: visitorIC,
      visitorCarPlate: visitorCarPlate,
      visitorTelNo: visitorTelNo,
      visitorVisitDateTime: visitorVisitDateTime,
      visitorVisitPurpose: visitorVisitPurpose,
    }).then(() => {
      setVisitorName("");
      setVisitorIC("");
      setVisitorCarPlate("");
      setVisitorTelNo("");
      setVisitorVisitDateTime("");
      setVisitorVisitPurpose("");
      alert("Added successfully");
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name (same as Identity Card)</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorName}
            onChangeText={(text) =>
              setVisitorName(text.replace(/[^a-zA-Z]/g, "").toUpperCase())
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
            <Text>{visitorVisitDateTime.toLocaleString()}</Text>
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
          <TouchableOpacity style={styles.button} onPress={addVisitor}>
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
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
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

export default RegisterNewVisitor;
