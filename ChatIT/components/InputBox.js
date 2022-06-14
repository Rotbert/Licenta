import {
  Entypo,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import db, { auth } from "../firebase";
import firebase from "firebase/compat/app";
import Filter from "bad-words";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";

const axiosAPI = axios.create({
  baseURL: "http://10.0.2.2:8082/whitelist",
});

const InputBox = ({ chatId }) => {
  const navigation = useNavigation();
  const filter = new Filter();

  const [message, setMessage] = useState("");
  const [allowProfanity, setAllowProfanity] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setAllowProfanity(snapshot.data().allowProfanity);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onMicrophonePress = () => {
    console.warn("Microphone");
  };

  const checkProfanity = () => {
    if (!allowProfanity && filter.isProfane(message)) {
      Alert.alert(
        "Profanity Alert!",
        "This message contains profanity. Are you sure you want to send it?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              sendMessage();
              axiosAPI
                .get("/get-number/" + auth.currentUser.email)
                .then((response) => {
                  if (response.data === "") {
                    axiosAPI
                      .post(
                        "/save", {
                          name: auth.currentUser.displayName,
                          email: auth.currentUser.email,
                          numberOfOffensiveMessages: "1",
                        }
                      )
                  } else {
                    axiosAPI
                      .put(
                        "/update", {
                          email: auth.currentUser.email,
                          numberOfOffensiveMessages: (parseInt(response.data) + 1).toString(),
                        }
                      )
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            },
          },
        ]
      );
    } else {
      sendMessage();
    }
  };

  const sendMessage = () => {
    db.collection("users")
      .doc(auth.currentUser.email)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        message: message,
        email: auth.currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("users")
      .doc(chatId)
      .collection("chats")
      .doc(auth.currentUser.email)
      .collection("messages")
      .add({
        message: message,
        email: auth.currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        seen: false,
      });
    db.collection("users")
      .doc(auth.currentUser.email)
      .collection("chats")
      .doc(chatId)
      .update({
        lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("users")
      .doc(chatId)
      .collection("chats")
      .doc(auth.currentUser.email)
      .update({
        lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    setMessage("");
  };

  const handleSendMessage = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      checkProfanity();
    }
  };

  const handleOpenCamera = () => {
    navigation.navigate("Camera");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name="laugh-beam" size={24} color="grey" />
        <TextInput
          placeholder={"Type a message"}
          style={styles.textInput}
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <Entypo name="attachment" size={24} color="grey" style={styles.icon} />
        {!message && (
          <TouchableOpacity onPress={handleOpenCamera}>
            <Fontisto
              name="camera"
              size={24}
              color="grey"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleSendMessage}>
        <View style={styles.buttonContainer}>
          {!message ? (
            <MaterialCommunityIcons
              name={"microphone"}
              size={28}
              color="white"
            />
          ) : (
            <MaterialIcons name={"send"} size={28} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "flex-end",
  },
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: "#0782F9",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
