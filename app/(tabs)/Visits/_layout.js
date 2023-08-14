import { Stack } from "expo-router";

const VisitsScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default VisitsScreenLayout;
