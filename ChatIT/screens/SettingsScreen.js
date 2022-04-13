import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Switch,
  Alert,
} from "react-native";
import db, { auth } from "../firebase";
import prompt from "react-native-prompt-android";

const SettingsScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const [allowProfanity, setAllowProfanity] = useState();
  const [profanityState, setProfanityState] = useState("");

  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const currentUser = snapshot.data();

          if (currentUser.allowProfanity) {
            setProfanityState("Profanity is allowed!");
          } else {
            setProfanityState("Profanity is censored!");
          }

          // set everything for later usage
          setCurrentUser(currentUser);
          setAllowProfanity(currentUser.allowProfanity);
          setName(currentUser.name);
          setSurname(currentUser.surname);
          setEmail(auth.currentUser.email);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSave = () => {
    if (verifyEmptiness(name, surname)) {
      db.collection("users").doc(auth.currentUser.email).update({
        name: name,
        surname: surname,
        allowProfanity: allowProfanity,
      });
    } else {
      Alert.alert("Error", "Name and/or surname cannot be empty!", [
        {
          text: "Ok",
          style: "ok",
        },
      ]);
    }

    if (newPassword !== "") {
      if (verifyPassword(repeatedPassword)) {
        prompt(
          "Sign in",
          "Please sign in again in order to change your password",
          [
            {
              text: "Sign in",
              onPress: (text) => setPassword(text),
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          {
            type: "secure-text",
            cancelable: false,
            defaultValue: "test",
            placeholder: "placeholder",
          }
        );

        // .then(
        //   auth
        //     .signInWithEmailAndPassword(email, password)
        //     .catch((error) => alert(error.message))
        // )
        // .then(auth.currentUser.updatePassword(newPassword));
      } else {
        Alert.alert(
          "Error",
          "Passwords must match and and be at least 6 characters long!",
          [
            {
              text: "Ok",
              style: "ok",
            },
          ]
        );
      }
    }
  };

  const changeState = () => {
    setAllowProfanity((previousState) => !previousState);

    // i dont't know why but here the logic is reversed
    if (!allowProfanity) {
      setProfanityState("Profanity is allowed!");
    } else {
      setProfanityState("Profanity is censored!");
    }
  };

  const verifyPassword = (repeatedPassword) => {
    return repeatedPassword === newPassword && newPassword.length >= 6;
  };

  const verifyEmptiness = (name, surname) => {
    return name !== "" && surname !== "";
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
          placeholder={currentUser.name}
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder={currentUser.surname}
          value={surname}
          onChangeText={(text) => setSurname(text)}
          style={styles.input}
        ></TextInput>
        {/* <TextInput
          placeholder={auth.currentUser.email}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        ></TextInput> */}
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
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

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>{profanityState}</Text>
        <Switch
          trackColor={{ false: "grey", true: "#0782F9" }}
          thumbColor={allowProfanity ? "#cbd3d8" : "#cbd3d8"}
          onValueChange={changeState}
          value={!allowProfanity}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  toggleContainer: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: "80%",
    height: "8.5%",
  },
  toggleText: {
    marginRight: "33%",
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
