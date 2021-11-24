import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Fontisto } from "@expo/vector-icons";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import * as React from "react";
import ChatsScreen from "../screens/ChatsScreen";

const MainTab = createMaterialTopTabNavigator();

export default function MainTabNavigator() {
  return (
    <MainTab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#0782F9",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#fff",
          height: 4,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <MainTab.Screen
        name="Camera"
        component={ChatRoomScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Fontisto name="camera" color={color} size={18} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <MainTab.Screen name="Chats" component={ChatsScreen} />
      <MainTab.Screen name="Status" component={ChatRoomScreen} />
      <MainTab.Screen name="Calls" component={ChatRoomScreen} />
    </MainTab.Navigator>
  );
}
