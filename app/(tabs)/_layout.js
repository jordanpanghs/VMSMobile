import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: () => {
            return <Icon name="home" size={20} color={"black"} />;
          },
        }}
      />
      <Tabs.Screen name="list" />
    </Tabs>
  );
};
