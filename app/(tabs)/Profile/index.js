import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { useAuth } from "../../../context/AuthContext";

import { useRouter } from "expo-router";

import { db } from "../../../firebase";

import { doc, updateDoc } from "firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function Profile() {
  const { logout, currentUser, userIsSecurity, userResidentUnit } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      uploadExpoPushToken(token, currentUser)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response.notification.request.content.data.route);
        if (response.notification.request.content.data.route == "visits") {
          return router.push("visits");
        }
        if (response.notification.request.content.data.route == "parcels") {
          return router.push("parcels");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function handleLogOut() {
    logout();
  }

  function handleChangePassword() {
    router.push("profile/editaccount");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={styles.textContainer}>
        <View style={styles.unitTextContainer}>
          <Text style={styles.text}>Hello, </Text>
          <Text style={styles.text}>
            {!userIsSecurity ? currentUser.displayName : "Security"}
          </Text>
        </View>

        {!userIsSecurity && (
          <View style={styles.unitTextContainer}>
            <Text style={styles.text}>Unit No.</Text>
            <Text style={styles.text}>{userResidentUnit}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleChangePassword()}
        >
          <Text style={styles.buttonText}>Change Account Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
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

async function uploadExpoPushToken(token, currentUser) {
  try {
    const userDocRef = doc(db, "users", currentUser.uid);

    await updateDoc(userDocRef, {
      notificationToken: token,
    });

    console.log("Expo Push Token uploaded");
  } catch (error) {
    console.log(error);
  }
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  unitTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "DMRegular",
    fontSize: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "DMBold",
  },
});
