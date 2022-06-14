import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation/Navigation";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer for a long", "AsyncStorage has been extracted", "Can't perform a React"]);

  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}
