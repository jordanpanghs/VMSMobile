import { Tabs } from "expo-router";
import Ionicon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RegisterNewVisitor from "../../components/user/register/RegisterNewVisitor";

export default () => {
  return (
    //Bottom Tab Bar Navigator

    <Tabs
      screenOptions={{
        tabBarStyle: { height: 65 },
        tabBarLabelStyle: { fontSize: 13, marginTop: 0, marginBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => {
            return <Ionicon name="home" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="Visits"
        options={{
          tabBarLabel: "Visits",
          tabBarIcon: () => {
            return (
              <MaterialIcons name="emoji-people" size={30} color={"black"} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="Register"
        options={{
          tabBarLabel: "Register",
          tabBarIcon: () => {
            return <Feather name="plus-square" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="Parcels"
        options={{
          tabBarLabel: "Parcels",
          tabBarIcon: () => {
            return <Feather name="package" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => {
            return (
              <MaterialCommunityIcons
                name="account"
                size={30}
                color={"black"}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};
