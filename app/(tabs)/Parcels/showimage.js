import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

import { Stack, useLocalSearchParams } from "expo-router";

export default showimage = () => {
  const params = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: params.headerTitle }} />
      <Image
        source={{
          uri: params.imageURL,
        }}
        alt="No Image Selected"
        style={{
          flex: 1,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
