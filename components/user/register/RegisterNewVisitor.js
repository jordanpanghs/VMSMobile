import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <Text style={styles.label}>Identity Card Number:</Text>
      <TextInput
        style={styles.input}
        value={idNumber}
        onChangeText={(text) => setIdNumber(text)}
      />

      <Text style={styles.label}>Car Plate Number:</Text>
      <TextInput
        style={styles.input}
        value={carPlateNumber}
        onChangeText={(text) => setCarPlateNumber(text)}
      />

      <Text style={styles.label}>Telephone Number:</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />

      <Text style={styles.label}>Visiting Date:</Text>
      <TextInput
        style={styles.input}
        value={visitDate}
        onChangeText={(text) => setVisitDate(text)}
      />

      <Text style={styles.label}>Visiting Time:</Text>
      <TextInput
        style={styles.input}
        value={visitTime}
        onChangeText={(text) => setVisitTime(text)}
      />

      <Text style={styles.label}>Visiting Purpose:</Text>
      <TextInput
        style={styles.input}
        value={visitPurpose}
        onChangeText={(text) => setVisitPurpose(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    columnGap: 20,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
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
