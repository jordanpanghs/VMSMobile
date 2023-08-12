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
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [carPlateNumber, setCarPlateNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");

  const handleSubmit = () => {
    // Handle form submission here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name (same as Identity Card)</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Identity Card Number:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={idNumber}
          onChangeText={(text) => setIdNumber(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Car Plate Number:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={carPlateNumber}
          onChangeText={(text) => setCarPlateNumber(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telephone Number:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Visiting Date:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={visitDate}
          onChangeText={(text) => setVisitDate(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Visiting Time:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={visitTime}
          onChangeText={(text) => setVisitTime(text.toUpperCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Visiting Purpose:</Text>
        <TextInput
          autoCapitalize="characters"
          selectionColor="#007aff"
          style={styles.input}
          value={visitPurpose}
          onChangeText={(text) => setVisitPurpose(text.toUpperCase())}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    padding: 25,
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
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterNewVisitor;
