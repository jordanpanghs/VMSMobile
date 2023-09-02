import { Tabs } from "expo-router";
import Ionicon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RegisterNewVisitor from "../../components/user/register/RegisterNewVisitor";

import { useAuth } from "../../context/AuthContext";

export default () => {
  const { currentUser, userIsSecurity } = useAuth();

  return (
    //Bottom Tab Bar Navigator

    <Tabs
      screenOptions={{
        tabBarStyle: { height: 65 },
        tabBarLabelStyle: { fontSize: 13, marginTop: 0, marginBottom: 5 },
        tabBarActiveBackgroundColor: "#f2f2f2",
        tabBarActiveTintColor: "#007aff",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="visits"
        options={{
          headerTitle: "Visits",
          tabBarLabel: "Visits",
          tabBarIcon: ({ focused, color }) => {
            return (
              <MaterialIcons name="emoji-people" size={30} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          headerTitle: "Register",
          tabBarLabel: "Register",
          tabBarIcon: ({ focused, color }) => {
            return <Feather name="plus-square" size={30} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="parcels"
        options={{
          headerTitle: "Parcels",
          tabBarLabel: "Parcels",
          tabBarIcon: ({ focused, color }) => {
            return <Feather name="package" size={30} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => {
            return (
              <MaterialCommunityIcons name="account" size={30} color={color} />
            );
          },
        }}
      />
    </Tabs>
  );
};
