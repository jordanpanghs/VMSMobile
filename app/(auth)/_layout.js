import LoginScreen from "../../components/LoginScreen";
import { Stack } from "expo-router";

export default function Login() {
  // return <LoginScreen />;
  return (
    <Stack>
      <Stack.Screen name="Login"></Stack.Screen>
    </Stack>
  );
}
