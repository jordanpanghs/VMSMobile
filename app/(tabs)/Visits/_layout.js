import { Stack } from "expo-router";

const VisitsScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="qrcode" />
      <Stack.Screen name="editvisitor" />
    </Stack>
  );
};

export default VisitsScreenLayout;
