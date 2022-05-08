import React, { useEffect, useState, useRef } from "react";
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
import { Transition, Transitioning } from "react-native-reanimated";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState("");

  const verifiedUser = auth.currentUser.emailVerified;
  const verifiedUserMessage = verifiedUser
    ? "Verified user!"
    : "Please verify your email!";

  const [allowProfanity, setAllowProfanity] = useState();
  const [profanityState, setProfanityState] = useState("");

  const ref = useRef();
  const [deleteDropDown, setDeleteDropDown] = useState(false);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
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

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          doc: doc,
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const changeState = () => {
    setAllowProfanity((previousState) => !previousState);

    // i dont't know why but here the logic is reversed
    if (!allowProfanity) {
      setProfanityState("Profanity is allowed!");
    } else {
      setProfanityState("Profanity is censored!");
    }
  };

  const verifyEmptiness = (name, surname) => {
    return name !== "" && surname !== "";
  };

  const deleteChat = (userId, chatId) => {
    db.collection("users/" + userId + "/chats/" + chatId + "/messages")
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.docs.map((doc) => {
            db.collection("users/" + userId + "/chats/" + chatId + "/messages")
              .doc(doc.id)
              .delete()
              .catch((error) => {
                alert(
                  error.message.split(/[:.]+/)[1] +
                    "!" +
                    " Message not deleted!"
                );
              });
          });
        }
      });

    db.collection("users/" + userId + "/chats")
      .doc(chatId)
      .delete()
      .catch((error) => {
        alert(error.message.split(/[:.]+/)[1] + "!" + " Chat not deleted!");
      });
  };

  const deleteAllData = () => {
    users.map((user) => {
      if (user.id === email) {
        deleteChat(email, user.id);
      } else {
        deleteChat(user.id, email);
      }
    });

    db.collection("users")
      .doc(email)
      .delete()
      .catch((error) => {
        alert(error.message.split(/[:.]+/)[1] + "!" + " User not deleted");
      });
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message.split(/[:.]+/)[1] + "!"));
  };

  const handleDelete = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      deleteAllData();

      auth.currentUser.delete().catch((error) => {
        alert(error.message.split(/[:.]+/)[1] + "!");
      });
    });

    handleSignOut();
  };

  const handleChangePassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Alert",
          "An password reset email has been sent to your address!",
          [
            {
              text: "Ok",
              style: "ok",
            },
          ]
        );
      })
      .catch((error) => {
        alert(error.message.split(/[:.]+/)[1] + "!");
      });
  };

  const handleSave = () => {
    if (verifyEmptiness(name, surname)) {
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({
          name: name,
          surname: surname,
          displayName: name + " " + surname,
          allowProfanity: allowProfanity,
        });
      auth.currentUser.updateProfile({
        displayName: name + " " + surname,
      });
    } else {
      Alert.alert("Alert", "Name and/or surname cannot be empty!", [
        {
          text: "Ok",
          style: "ok",
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View
        style={styles.topContainer}
        backgroundColor={verifiedUser ? "green" : "red"}
      >
        <Text style={styles.topText}>{verifiedUserMessage}</Text>
        {verifiedUser ? (
          <MaterialIcons
            name="verified-user"
            size={24}
            color="black"
            style={styles.topIconVerified}
          />
        ) : (
          <Octicons
            name="unverified"
            size={24}
            color="black"
            style={styles.topIconNotVerified}
          />
        )}
      </View>

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

      <Transitioning.View
        ref={ref}
        transition={transition}
        style={styles.bottomContainer}
      >
        <TouchableOpacity
          onPress={() => {
            ref.current.animateNextTransition();
            setDeleteDropDown((previousState) => !previousState);
            setPassword("");
          }}
          activeOpacity={0.5}
        >
          <View>
            <Text style={styles.heading}>DELETE ACCOUNT</Text>
            <View style={styles.subCategories}>
              {deleteDropDown && (
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  style={styles.input}
                  secureTextEntry
                ></TextInput>
              )}
              {deleteDropDown && (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleChangePassword} activeOpacity={0.5}>
          <Text style={styles.heading}>CHANGE PASSWORD</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </Transitioning.View>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  topContainer: {
    position: "relative",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderRadius: 10,
    marginTop: 5,
    width: "80%",
  },
  toggleContainer: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderRadius: 10,
    marginTop: 5,
    width: "80%",
  },
  topText: {
    position: "relative",
  },
  topIconNotVerified: {
    position: "relative",
    left: 120,
  },
  topIconVerified: {
    position: "relative",
    left: 190,
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
  button: {
    backgroundColor: "#0782F9",
    marginTop: 40,
    marginLeft: "20%",
    marginRight: "20%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#0782F9",
    marginTop: 5,
    marginLeft: "20%",
    marginRight: "20%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomContainer: {
    width: "80%",
  },
  heading: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 5,
    textAlign: "center",
    color: "#0782F9",
    borderWidth: 1,
    borderColor: "#0782F9",
  },
});
