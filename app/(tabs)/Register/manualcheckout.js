import { StyleSheet, Text, View } from "react-native";
import React from "react";

import ManualCheckOut from "../../../components/security/register/ManualCheckOut";
import { Stack } from "expo-router";

const manualcheckout = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          headerTitle: "Manual Check Out Visitor",
        }}
      />
      <ManualCheckOut />
    </View>
  );
};

export default manualcheckout;

const styles = StyleSheet.create({});
