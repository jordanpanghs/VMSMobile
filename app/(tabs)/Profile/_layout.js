import { Stack } from "expo-router";

const ProfileScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="editaccount"
        options={{ headerShown: true, headerTitle: "Change Account Password" }}
      />
    </Stack>
  );
};

export default ProfileScreenLayout;
