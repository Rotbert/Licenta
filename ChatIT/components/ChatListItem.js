import React, { useEffect, useState } from "react";
import { Text, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import db, { auth } from "../firebase";
import moment from "moment";
import ChatFilter from "./ChatFilter";

const ChatListItem = ({ id, email }) => {
  const [messages, setMessages] = useState([]);
  const [allowProfanity, setAllowProfanity] = useState();

  const navigation = useNavigation();

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

  useEffect(() => {
    if (id) {
      const unsubscribe = db
        .collection("users")
        .doc(auth.currentUser.email)
        .collection("chats")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );

      return () => {
        unsubscribe();
      };
    }
  }, [id]);

  const isMyMessage = () => {
    return messages[0]?.data.email === auth.currentUser.email;
  };

  const onClick = () => {
    navigation.navigate("ChatRoom", {
      id: id,
      email: email,
    });

    db.collection("users")
      .doc(auth.currentUser.email)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .doc(messages[0]?.id)
      .update({
        seen: true,
      });
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View
        style={
          messages[0]?.data.seen || isMyMessage()
            ? styles.container
            : [styles.container, styles.newMessage]
        }
      >
        <View style={styles.leftContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color="gray" />
          </View>

          <View style={styles.midContainer}>
            <Text style={styles.username}>{email}</Text>
            <Text style={styles.lastMessage}>
              {allowProfanity
                ? messages[0]?.data.message
                : ChatFilter(messages[0]?.data.message)}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>
          {moment(messages[0]?.data.timestamp?.toDate()).format("DD/MM/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "98%",
    justifyContent: "space-between",
    padding: 10,
    borderBottomColor: "#f9f9f9",
    borderBottomWidth: 0.5,
    marginTop: 5,
    marginLeft: "1%",
  },
  newMessage: {
    borderWidth: 1,
    borderColor: "#0782F9",
    borderBottomColor: "#0782F9",
    borderBottomWidth: 1,
    borderRadius: 15,
  },
  leftContainer: {
    flexDirection: "row",
  },
  midContainer: {
    width: "60%",
    height: "40%",
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
  lastMessage: {
    fontSize: 16,
    color: "grey",
  },
  time: {
    fontSize: 14,
    color: "grey",
  },
});
