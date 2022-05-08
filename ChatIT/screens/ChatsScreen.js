import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import NoChatsAvailable from "../components/NoChatsAvailable";
import db from "../firebase";
import { auth } from "../firebase";

const ChatsScreen = () => {
  const [chats, setChats] = useState([]);

  if (!auth.currentUser.emailVerified) {
    Alert.alert(
      "Alert",
      "Your email address is not yet verified! Please verify it as soon as you can.",
      [
        {
          text: "Ok",
          style: "ok",
        },
      ]
    );
  }

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.email)
      .collection("chats")
      .orderBy("lastMessageTimestamp", "desc")
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            displayName: doc.data().displayName,
          }))
        )
      );

    return () => {
      unsubscribe();
    };
  }, []);

  const isEmpty = () => {
    if (chats.length === 0) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {isEmpty() ? (
          <NoChatsAvailable />
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              email={chat.id}
              displayName={chat.displayName}
            />
          ))
        )}
      </ScrollView>
      <NewMessageButton />
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
