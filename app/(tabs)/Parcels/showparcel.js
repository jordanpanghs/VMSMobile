import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

import { Stack, useLocalSearchParams } from "expo-router";

const showparcel = () => {
  const params = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Parcel Image" }} />
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

export default showparcel;

const styles = StyleSheet.create({});
