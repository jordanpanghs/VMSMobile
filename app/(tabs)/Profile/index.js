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
      <View>
        <Text>Hello, {currentUser.displayName}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
