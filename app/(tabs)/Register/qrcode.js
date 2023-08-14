import { Text, View } from "react-native";
import React, { Component } from "react";
import { Stack } from "expo-router";

export class test extends Component {
  render() {
    return (
      <View>
        <Stack.Screen options={{ headerTitle: "" }} />
        <Text>Test</Text>
      </View>
    );
  }
}

export default test;
