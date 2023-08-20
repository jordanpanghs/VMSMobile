import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { Component, useState } from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import RegisterNewVisitor from "../../../components/user/register/RegisterNewVisitor";
import RegisterNewParcel from "../../../components/user/register/RegisterNewParcel";

import RegisterVisitor from "../../../components/security/register/RegisterVisitor";
import RegisterParcel from "../../../components/security/register/RegisterParcel";

import { useAuth } from "../../../context/AuthContext";

const Tab = createMaterialTopTabNavigator();

function RegisterVisitorScreen() {
  return <RegisterNewVisitor />;
}

function RegisterParcelScreen() {
  return <RegisterNewParcel />;
}

export default function Home() {
  const { currentUser, userIsSecurity } = useAuth();

  return (
    <Tab.Navigator>
      {currentUser && userIsSecurity && (
        <Tab.Screen name="Register Visitor" component={RegisterVisitor} />
      )}
      {currentUser && userIsSecurity && (
        <Tab.Screen name="Register Parcel" component={RegisterParcel} />
      )}
      {currentUser && !userIsSecurity && (
        <Tab.Screen name="Register Visitor" component={RegisterVisitorScreen} />
      )}
      {currentUser && !userIsSecurity && (
        <Tab.Screen name="Register Parcel" component={RegisterParcelScreen} />
      )}
    </Tab.Navigator>
  );
}
