import { Stack } from "expo-router";

const ParcelScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ParcelScreenLayout;
