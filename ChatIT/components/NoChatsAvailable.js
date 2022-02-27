import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

const NoChatsAvailable = () => {
  return (
    <View style={styles.container}>
      <Entypo name="chat" size={154} color="gray" />
      <Text style={styles.mainText}>It's nice to chat with someone</Text>
      <Text style={styles.auxText}>
        Pick a person from right bottom corner button
      </Text>
      <Text style={styles.auxText}>and start your conversation</Text>
    </View>
  );
};

export default NoChatsAvailable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "black",
    fontWeight: "700",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  auxText: {
    color: "gray",
    fontWeight: "700",
    fontSize: 16,
  },
});
