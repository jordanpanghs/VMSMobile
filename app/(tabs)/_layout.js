import { Tabs } from "expo-router";
import Ionicon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 65 }, // set the background color for the tab bar
        tabBarLabelStyle: { fontSize: 13, marginTop: 0, marginBottom: 5 }, // set the font size and margin for the tab bar label
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => {
            return <Ionicon name="home" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="visits"
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
        name="register"
        options={{
          tabBarLabel: "Register",
          tabBarIcon: () => {
            return <Feather name="plus-square" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="parcels"
        options={{
          tabBarLabel: "Parcels",
          tabBarIcon: () => {
            return <Feather name="package" size={30} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
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
