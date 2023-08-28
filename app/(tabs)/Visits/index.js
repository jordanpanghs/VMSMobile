import React, { useState, useEffect, useRef } from "react";

import UpcomingVisits from "../../../components/user/visits/UpcomingVisits";
import PastVisits from "../../../components/user/visits/PastVisits";
import CheckedInVisitors from "../../../components/security/visits/CheckedInVisitors";
import RegisteredVisitsToday from "../../../components/security/visits/RegisteredVisitsToday";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { useAuth } from "../../../context/AuthContext";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const Tab = createMaterialTopTabNavigator();

export default function Visits() {
  const { userIsSecurity } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        router.push("visits");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } catch (e) {
      console.log(e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
