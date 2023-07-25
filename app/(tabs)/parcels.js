import { Text, View } from "react-native";
import React, { Component } from "react";

import ClaimedParcels from "../../components/user/parcels/ClaimedParcels";
import UnclaimedParcels from "../../components/user/parcels/UnclaimedParcels";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function Parcels() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Unclaimed Parcels" component={UnclaimedParcels} />
      <Tab.Screen name="Claimed Parcels" component={ClaimedParcels} />
    </Tab.Navigator>
  );
}
