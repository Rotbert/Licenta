import React from "react";
import { TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import {
  Octicons,
  Feather,
  MaterialIcons,
  FontAwesome5,
  SimpleLineIcons,
  AntDesign,
} from "@expo/vector-icons";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import LinkingConfiguration from "./LinkingConfiguration";
import MainTabNavigator from "./MainTabNavigation";
import RegisterScreen from "../screens/RegisterScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Navigation = ({ colorScheme }) => {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message.split(/[:.]+/)[1] + "!"));
  };

  const handleBackToChatsButton = () => {
    navigation.navigate("Root");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0782F9",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="Root"
        component={MainTabNavigator}
        options={{
          title: "ChatIT",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 60,
                justifyContent: "space-between",
                marginRight: 10,
              }}
            >
              <Octicons name="search" size={22} color="white" />
              <TouchableOpacity onPress={handleSettings}>
                <Feather name="settings" size={22} color="white" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleSignOut}>
              <SimpleLineIcons
                name="logout"
                size={22}
                color="white"
                style={{
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.displayName,
          params: route.params,
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 100,
                justifyContent: "space-between",
              }}
            >
              <FontAwesome5 name="video" size={22} color={"white"} />
              <MaterialIcons name="call" size={22} color={"white"} />
              <Feather name="settings" size={22} color={"white"} />
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackToChatsButton}>
              <AntDesign
                name="arrowleft"
                size={22}
                color="white"
                style={{
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        })}
      />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
    </Stack.Navigator>
  );
}
