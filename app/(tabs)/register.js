import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { Component, useState } from "react";
import SwitchSelector from "react-native-switch-selector";
import RegisterNewVisitor from "../../components/user/register/RegisterNewVisitor";

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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {registerSelection === "visitor" && <RegisterNewVisitor />}
      </ScrollView>
      <SwitchSelector
        options={options}
        initial={0}
        style={styles.floatingButton}
        buttonColor={"#000"}
        borderRadius={5}
        hasPadding
        onPress={(value) => setRegisterSelection(value)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "90%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});
