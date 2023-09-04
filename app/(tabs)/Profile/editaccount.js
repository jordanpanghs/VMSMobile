import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { useAuth } from "../../../context/AuthContext";

import { useRouter } from "expo-router";

const editaccount = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const router = useRouter();

  const handleChangePassword = () => {
    setIsLoading(true);
    if (currentPassword === "") {
      return alert("Please enter your current password");
    }
    if (password === "") {
      return alert("Please enter a new password");
    }
    if (confirmPassword === "") {
      return alert("Please confirm your new password");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    console.log(currentPassword, password, confirmPassword);

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          updatePassword(currentUser, password)
            .then(() => {
              setCurrentPassword("");
              setPassword("");
              setConfirmPassword("");
              setIsLoading(false);
              alert("Password updated successfully!");
              router.back();
            })
            .catch((error) => {
              alert(error);
              console.log(error);
            });
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password:</Text>
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.input}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password:</Text>
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.button}
            onPress={() => handleChangePassword()}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default editaccount;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    height: "auto",
    padding: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "DMRegular",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontFamily: "DMBold",
  },
  buttonContainer: {
    width: "50%",
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMBold",
  },
});
