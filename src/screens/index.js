import { StyleSheet, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/icon";
import FeedScreen from "./feed";
import AppTabBar from "../components/app_tab_bar";
import Header from "../components/header";
import CustomText from "../components/text";
import Player from "../screens/player";
import Notifications from "./notifications";
import X from "./x";
import Search from "./search";
import Profile from "./profile";
import SignUpScreen from "./profile/SignUpScreen";
import UserListScreen from "../screens/profile/UserListScreen";
import UserProfileScreen from "./profile/UserProfileScreen";

import { tryLocalSignIn } from "../redux";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const MainFlow = () => {
  const activeTab = useSelector((state) => state.tab);
  const activePlayer = useSelector((state) => state.tab.player);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(tryLocalSignIn());
  }, []);

  let renderedScreen;

  const renderPlayer = () => {
    if (activePlayer) {
      return <Player />;
    }
  };

  switch (activeTab.name) {
    case "feed":
      renderedScreen = <FeedScreen />;
      break;
    case "x":
      renderedScreen = <X />;
      break;
    case "search":
      renderedScreen = <Search />;
      break;
    case "profile":
      renderedScreen = <Profile />;
      break;
    default:
      renderedScreen = <FeedScreen />;
      break;
  }

  console.log(renderedScreen);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <Header />
      {renderPlayer()}
      {renderedScreen}
    </View>
  );
};

export default MainApp = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          cardStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainFlow}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="UserListScreen"
          component={UserListScreen}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfileScreen}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </Stack.Navigator>
      <AppTabBar />
    </View>
  );
};

// export default MainFlow;

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    flex: 1,
    zIndex: 2,
    backgroundColor: "#000000",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
