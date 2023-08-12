import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React, { Component, useState } from "react";
import SwitchSelector from "react-native-switch-selector";

export default function Register() {
  const [registerSelection, setRegisterSelection] = useState("visitor");

  const handleSelection = (selection) => {
    setRegisterSelection(selection);
  };

  const options = [
    { label: "Visitor", value: "visitor" },
    { label: "Parcel", value: "parcel" },
  ];

  return (
    <View style={styles.container}>
      <Text>{registerSelection}</Text>
      <SwitchSelector
        options={options}
        initial={0}
        style={styles.floatingButton}
        buttonColor={"#000"}
        borderRadius={5}
        hasPadding
        onPress={(value) => setRegisterSelection(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});
