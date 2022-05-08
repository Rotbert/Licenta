import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, ScrollView, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/core";
import ChatMessage from "../components/ChatMessage";
import InputBox from "../components/InputBox.js";
import db from "../firebase";
import { auth } from "../firebase";

const ChatRoomScreen = () => {
  const scrollViewRef = useRef();

  const image = {
    uri: "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
  };

  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const chatId = route.params?.email;
  const displayName = route.params?.displayName;

  useEffect(() => {
    if (chatId) {
      const unsubscribe = db
        .collection("users")
        .doc(auth.currentUser.email)
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );

      return () => {
        unsubscribe();
      };
    }
  }, [chatId]);

  return (
    <ImageBackground
      style={[{ width: "100%", height: "100%" }, styles.container]}
      source={image}
    >
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => (
          <ChatMessage
            key={Math.random()}
            message={message}
            displayName={displayName}
          />
        ))}
      </ScrollView>
      <InputBox chatId={chatId} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
