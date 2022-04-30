import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth } from "../firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => alert(error.message.split(/[:.]+/)[1] + "!"))
      .then(navigation.navigate("Root"));

    clearInputs();
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email).catch((error) =>
      alert(error.message.split(/[:.]+/)[1] + "!")
    );
  };

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        ></TextInput>
      </View>

      <View style={styles.middleContainer}>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.buttonForgotPassword}
        >
          <Text style={styles.buttonOutlineText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUp} style={styles.buttonRegister}>
          <Text style={styles.buttonOutlineText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cbd3d8",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  middleContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    position: "relative",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonForgotPassword: {
    marginTop: 25,
  },
  buttonRegister: {
    position: "relative",
    top: 50,
  },
});
