import { Text, View } from "react-native";
import React, { Component } from "react";

import ClaimedParcels from "../../../components/user/parcels/ClaimedParcels";
import UnclaimedParcels from "../../../components/user/parcels/UnclaimedParcels";

import SecurityClaimedParcels from "../../../components/security/parcels/ClaimedParcels";
import SecurityUnclaimedParcels from "../../../components/security/parcels/UnclaimedParcels";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useAuth } from "../../../context/AuthContext";

const Tab = createMaterialTopTabNavigator();

export default function Parcels() {
  const { currentUser, userIsSecurity } = useAuth();

  return (
    <Tab.Navigator>
      {currentUser && !userIsSecurity && (
        <Tab.Screen name="Unclaimed Parcels" component={UnclaimedParcels} />
      )}
      {currentUser && !userIsSecurity && (
        <Tab.Screen name="Claimed Parcels" component={ClaimedParcels} />
      )}

      {currentUser && userIsSecurity && (
        <Tab.Screen
          name="Security Unclaimed Parcels"
          component={SecurityUnclaimedParcels}
          options={{ tabBarLabel: "Unclaimed Parcels" }}
        />
      )}

      {currentUser && userIsSecurity && (
        <Tab.Screen
          name="Security Claimed Parcels"
          component={SecurityClaimedParcels}
          options={{ tabBarLabel: "Claimed Parcels Today" }}
        />
      )}
    </Tab.Navigator>
  );
}
