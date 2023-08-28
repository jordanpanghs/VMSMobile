import React, { useState, useEffect, useRef } from "react";

import UpcomingVisits from "../../../components/user/visits/UpcomingVisits";
import PastVisits from "../../../components/user/visits/PastVisits";
import CheckedInVisitors from "../../../components/security/visits/CheckedInVisitors";
import RegisteredVisitsToday from "../../../components/security/visits/RegisteredVisitsToday";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useAuth } from "../../../context/AuthContext";

import { useRouter } from "expo-router";

const Tab = createMaterialTopTabNavigator();

export default function Visits() {
  const { userIsSecurity } = useAuth();

  return (
    <Tab.Navigator>
      {userIsSecurity && (
        <Tab.Screen
          name="Registered Visits Today"
          component={RegisteredVisitsToday}
        />
      )}
      {userIsSecurity && (
        <Tab.Screen name="Checked In Visitors" component={CheckedInVisitors} />
      )}
      {!userIsSecurity && (
        <Tab.Screen name="Upcoming Visits" component={UpcomingVisits} />
      )}
      {!userIsSecurity && (
        <Tab.Screen name="Past Visits" component={PastVisits} />
      )}
    </Tab.Navigator>
  );
}
