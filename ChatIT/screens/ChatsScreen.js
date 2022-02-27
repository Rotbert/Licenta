import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import NoChatsAvailable from "../components/NoChatsAvailable";
import db from "../firebase";
import { auth } from "../firebase";

const ChatsScreen = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("chats")
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return () => {
      unsubscribe();
    };
  }, []);

  const isEmpty = () => {
    if(chats.length === 0)
      return true;
    return false;
  };

  return (
    <View style={styles.container}>
      {isEmpty() ? (
        <NoChatsAvailable />
      ) : (
        chats.map((chat) => (
          <ChatListItem key={chat.id} id={chat.id} email={chat.data.email} />
        ))
      )}
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
