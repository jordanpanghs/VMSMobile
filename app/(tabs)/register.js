import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { Component, useState } from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import RegisterNewVisitor from "../../components/user/register/RegisterNewVisitor";
import RegisterNewParcel from "../../components/user/register/RegisterNewParcel";

const Tab = createMaterialTopTabNavigator();

function RegisterVisitorScreen() {
  return <RegisterNewVisitor />;
}

function RegisterParcelScreen() {
  return <RegisterNewParcel />;
}

export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Register Visitor" component={RegisterVisitorScreen} />
      <Tab.Screen name="Register Parcel" component={RegisterParcelScreen} />
    </Tab.Navigator>
  );
}
