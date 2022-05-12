import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import db, { auth } from "../firebase";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [repeatedEmail, setRepeatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const navigation = useNavigation();

  const handleSignUp = () => {
    if (verifyEmptiness(name, surname, email, password)) {
      if (verifyEmail(repeatedEmail) && verifyPassword(repeatedPassword)) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((credentials) => {
            db.collection("users")
              .doc(credentials.user.email)
              .set({
                uid: credentials.user.uid,
                name: name,
                surname: surname,
                displayName: name + " " + surname,
                allowProfanity: false,
              });
            sendEmailVerification(credentials.user);
            signInWithEmailAndPassword(auth, email, password).then(() => {
              navigation.navigate("Root").then(clearInputs());
            });
            credentials.user.updateProfile({
              displayName: name + " " + surname,
            });
          })
          .catch((error) => alert(error.message.split(/[:.]+/)[1] + "!"));
      } else if (!verifyEmail(repeatedEmail)) {
        Alert.alert("Alert", "Emails must match!", [
          {
            text: "Ok",
            style: "ok",
          },
        ]);
      } else if (!verifyPassword(repeatedPassword)) {
        Alert.alert("Alert", "Passwords must match!", [
          {
            text: "Ok",
            style: "ok",
          },
        ]);
      }
    } else {
      Alert.alert("Alert", "Please fill in all boxes!", [
        {
          text: "Ok",
          style: "ok",
        },
      ]);
    }
  };

  const goBackToLogin = () => {
    navigation.navigate("Login");
  };

  const verifyEmail = (repeatedEmail) => {
    return repeatedEmail === email;
  };

  const verifyPassword = (repeatedPassword) => {
    return repeatedPassword === password;
  };

  const verifyEmptiness = (name, surname, email, password) => {
    return name !== "" && surname !== "" && email !== "" && password !== "";
  };

  const clearInputs = () => {
    setName("");
    setSurname("");
    setEmail("");
    setRepeatedEmail("");
    setPassword("");
    setRepeatedPassword("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({
        ios: () => -100,
        android: () => 20,
      })()}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={"gray"}
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Surname"
          placeholderTextColor={"gray"}
          value={surname}
          onChangeText={(text) => setSurname(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Email"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Repeat Email"
          placeholderTextColor={"gray"}
          value={repeatedEmail}
          onChangeText={(text) => setRepeatedEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        ></TextInput>
        <TextInput
          placeholder="Repeat Password"
          placeholderTextColor={"gray"}
          value={repeatedPassword}
          onChangeText={(text) => setRepeatedPassword(text)}
          style={styles.input}
          secureTextEntry
        ></TextInput>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goBackToLogin}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
    paddingVertical: Platform.OS === "ios" ? 16 : 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
});
