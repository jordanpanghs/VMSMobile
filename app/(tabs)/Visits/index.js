import { Text, View } from "react-native";
import React, { Component } from "react";

import UpcomingVisits from "../../../components/user/visits/UpcomingVisits";
import PastVisits from "../../../components/user/visits/PastVisits";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function Visits() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upcoming Visits" component={UpcomingVisits} />
      <Tab.Screen name="Past Visits" component={PastVisits} />
    </Tab.Navigator>
  );
}
