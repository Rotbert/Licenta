import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Switch,
} from "react-native";
import db, { auth } from "../firebase";

const SettingsScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  const [censorProfanity, setCensorProfanity] = useState();
  const [profanityState, setProfanityState] = useState("");

  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setCurrentUser(snapshot.data());
          resolveProfanity();
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const resolveProfanity = () => {
    setCensorProfanity(!currentUser.allowProfanity);
    if (censorProfanity) {
      setProfanityState("Profanity is censored!");
    } else {
      setProfanityState("Profanity is allowed!");
    }
  }

  const handleSave = () => {
    db.collection("users").doc(auth.currentUser.email).update({
      name: name,
      surname: surname,
      allowProfanity: censorProfanity,
    });
  };

  const changeState = () => {
    setCensorProfanity((previousState) => !previousState);

    if (censorProfanity) {
      setProfanityState("Profanity is censored!");
    } else {
      setProfanityState("Profanity is allowed!");
    }
    console.log(censorProfanity);
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
        <TextInput
          placeholder={auth.currentUser.email}
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

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>{profanityState}</Text>
        <Switch
          trackColor={{ false: "grey", true: "#0782F9" }}
          thumbColor={censorProfanity ? "#cbd3d8" : "#cbd3d8"}
          onValueChange={changeState}
          value={!censorProfanity}
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
