import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

const RegisterNewVisitor = () => {
  const [visitorName, setName] = useState("");
  const [visitorIC, setIdNumber] = useState("");
  const [visitorCarPlate, setCarPlateNumber] = useState("");
  const [visitorTelNo, setPhoneNumber] = useState("");
  const [visitorVisitDateTime, setVisitDate] = useState("");
  const [visitorVisitPurpose, setVisitPurpose] = useState("");

  const addVisitor = () => {
    // const dbInstance = collection(db, "registeredVisitors");
    // addDoc(dbInstance, {
    //   //add visitor id according to the number of documents in the collection
    //   visitorName: visitorName,
    //   visitorIC: visitorIC,
    //   visitorCarPlate: visitorCarPlate,
    //   visitorTelNo: visitorTelNo,
    //   visitorVisitDateTime: visitorVisitDateTime,
    //   visitorVisitPurpose: visitorVisitPurpose,
    // }).then(() => {
    //   setVisitorName("");
    //   setVisitorIC("");
    //   setVisitorCarPlate("");
    //   setVisitorTelNo("");
    //   setVisitorVisitDateTime("");
    //   setVisitorVisitPurpose("");

    //   alert("Added successfully");
    //   // router.push("/");
    // });
    console.log("hi");
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
            onChangeText={(text) => setName(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Identity Card Number:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorIC}
            onChangeText={(text) => setIdNumber(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Car Plate Number:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorCarPlate}
            onChangeText={(text) => setCarPlateNumber(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telephone Number:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorTelNo}
            onChangeText={(text) => setPhoneNumber(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Date:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorVisitDateTime}
            onChangeText={(text) => setVisitDate(text.toUpperCase())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visiting Purpose:</Text>
          <TextInput
            autoCapitalize="characters"
            selectionColor="#007aff"
            style={styles.input}
            value={visitorVisitPurpose}
            onChangeText={(text) => setVisitPurpose(text.toUpperCase())}
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
