import moment from "moment";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { auth } from "../firebase";
import ChatFilter from "./ChatFilter";

const ChatMessage = ({ message }) => {
  const isMyMessage = () => {
    return message.email === auth.currentUser.email;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage() ? "#71C1FF" : "white",
            marginLeft: isMyMessage() ? 50 : 0,
            marginRight: isMyMessage() ? 0 : 50,
          },
        ]}
      >
        {!isMyMessage() && <Text style={styles.name}>{message.email}</Text>}
        <Text style={styles.message}>{ChatFilter(message.message)}</Text>
        <Text style={styles.time}>
          {moment(message?.timestamp?.toDate()).fromNow()}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
  },
  name: {
    color: "#0782F9",
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {},
  time: {
    alignSelf: "flex-end",
    color: "grey",
  },
});
