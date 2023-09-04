import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

import { Stack } from "expo-router";
import ManualCheckIn from "../../../components/security/register/ManualCheckIn";

const manualcheckin = () => {
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          headerTitle: "Manual Check In Visitor",
        }}
      />
      <ManualCheckIn />
    </ScrollView>
  );
};

export default manualcheckin;

const styles = StyleSheet.create({});
