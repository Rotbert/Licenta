import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import db from "../firebase";

const ContactiListItem = ({ id, email }) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("Chats").onSnapshot((snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onClick = () => {
    Alert.alert("New Chat", `Do you want to start a new chat with ${email}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          db.collection("Chats").doc(`${email}`).set({
            email: email,
          });
          navigation.navigate("ChatRoom", {
            id: email,
            email: email,
          });
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color="gray" />
          </View>

          <View style={styles.midContainer}>
            <Text style={styles.username}>{email}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactiListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  leftContainer: {
    flexDirection: "row",
  },
  midContainer: {
    justifyContent: "space-around",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
});
