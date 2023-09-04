import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";

import { Stack, useLocalSearchParams } from "expo-router";

export default showimage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: params.headerTitle,
          animation: "slide_from_right",
        }}
      />
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
      <Image
        source={{
          uri: params.imageURL,
        }}
        alt="No Image Selected"
        style={{
          flex: 1,
          resizeMode: "contain",
        }}
        onLoad={() => setIsLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({});
