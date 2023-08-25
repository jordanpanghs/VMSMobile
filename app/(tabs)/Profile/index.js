import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { Component } from "react";

import { useAuth } from "../../../context/AuthContext";

export default function Profile() {
  const { logout, currentUser, userIsSecurity, userResidentUnit } = useAuth();

  function handleLogOut() {
    logout();
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={styles.textContainer}>
        <View style={styles.unitTextContainer}>
          <Text style={styles.text}>Hello, </Text>
          <Text style={styles.text}>
            {!userIsSecurity ? currentUser.displayName : "Security"}
          </Text>
        </View>

        {!userIsSecurity && (
          <View style={styles.unitTextContainer}>
            <Text style={styles.text}>Unit No.</Text>
            <Text style={styles.text}>{userResidentUnit}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  unitTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "DMRegular",
    fontSize: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "DMBold",
  },
});
