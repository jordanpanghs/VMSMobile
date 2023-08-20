import { Stack } from "expo-router";

const RegisterScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="findvisitor"
        options={{ headerTitle: "Check In Visitor", headerShown: true }}
      />
    </Stack>
  );
};

export default RegisterScreenLayout;
