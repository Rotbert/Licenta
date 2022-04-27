import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import db, { auth } from "../firebase";
import { sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [repeatedEmail, setRepeatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const navigation = useNavigation();

  // IF YOU DECIDE THAT AFTER REGISTRATUION YOU WANT THE USER TO AUTOMATICALLY LOG IN
  // THEN UNCOMMENT THIS CODE AND DELETE LINE WITH goBackToLogin FROM handleSignUp
  //
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigation.navigate("Root");
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const handleSignUp = () => {
    if (verifyEmptiness(name, surname, email, password)) {
      if (verifyEmail(repeatedEmail) && verifyPassword(repeatedPassword)) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((credentials) => {
            db.collection("users").doc(credentials.user.email).set({
              uid: credentials.user.uid,
              name: name,
              surname: surname,
              allowProfanity: false,
              verifiedUser: credentials.user.emailVerified,
            });
            sendEmailVerification(credentials.user);
          })
          .catch((error) => alert(error.message.split(/[:.]+/)[1] + '!'));
        clearInputs();
        goBackToLogin();
      } else if (!verifyEmail(repeatedEmail)) {
        Alert.alert("Error", "Emails must match!", [
          {
            text: "Ok",
            style: "ok",
          },
        ]);
      } else if (!verifyPassword(repeatedPassword)) {
        Alert.alert("Error", "Passwords must match!", [
          {
            text: "Ok",
            style: "ok",
          },
        ]);
      }
    } else {
      Alert.alert("Error", "Please fill in all boxes!", [
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
    setEmail("");
    setPassword("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Surname"
          value={surname}
          onChangeText={(text) => setSurname(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Repeat Email"
          value={repeatedEmail}
          onChangeText={(text) => setRepeatedEmail(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        ></TextInput>
        <TextInput
          placeholder="Repeat Password"
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
    paddingVertical: 10,
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
