import { Stack } from "expo-router";

const RegisterScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RegisterScreenLayout;
