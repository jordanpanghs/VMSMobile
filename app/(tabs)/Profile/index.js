import { Text, View } from "react-native";
import React, { Component } from "react";

import { useAuth } from "../../../context/AuthContext";

export default function Profile() {
  const { logout, currentUser, userIsSecurity, userResidentUnit } = useAuth();

  function handleLogOut() {
    logout();
  }

  function handlePress() {
    console.log(currentUser.uid);
    console.log(userIsSecurity);
    console.log(userResidentUnit);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 100,
      }}
    >
      <Text>Hello, {currentUser.displayName}</Text>
      <Text onPress={handlePress}>Console Log User</Text>
      <Text onPress={handleLogOut}>Log Out!</Text>
    </View>
  );
}
