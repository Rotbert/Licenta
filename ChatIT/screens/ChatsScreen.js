import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import db from "../firebase";

const ChatsScreen = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("Chats").onSnapshot((snapshot) =>
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

  return (
    <View style={styles.container}>
      {chats.map((chat) => (
        <ChatListItem key={chat.id} id={chat.id} email={chat.data.email} />
      ))}
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
