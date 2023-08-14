import { Stack } from "expo-router";

const RegisterScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="qrcode" options={{ headerTitle: "" }} />
    </Stack>
  );
};

export default RegisterScreenLayout;
