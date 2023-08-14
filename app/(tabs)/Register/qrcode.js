import { View, Text, Button } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";

const qrcode = () => {
  const router = useRouter();

  return (
    <View>
      <Text>qrcode</Text>
      <Button title="Click me" onPress={() => router.push("/home")} />
    </View>
  );
};

export default qrcode;
