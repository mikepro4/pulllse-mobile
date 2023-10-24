import React, { useState, useEffect, useCallback } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchUserInfo, fetchUserAudios } from "./src/redux";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-devsettings";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

import MainFlow from "./src/screens/";

import { StatusBar } from "expo-status-bar";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const LoginStack = () => (
  <Stack.Navigator
    options={{ headerShown: false }}
    screenOptions={{
      cardStyle: { backgroundColor: "transparent" },
    }}
  >
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signin"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const App = () => {
  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  const fetchUserDetails = async () => {
    const userIdFromStorage = await AsyncStorage.getItem("userId"); // Retrieving userId from AsyncStorage

    if (userIdFromStorage) {
      dispatch(fetchUserInfo({ userId: userIdFromStorage })); // Passing userId as an argument to your action
      dispatch(fetchUserAudios({ userId: userIdFromStorage }));
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [storedUserInfo._id]);

  return (
    <NavigationContainer
      screenOptions={{
        cardStyle: { backgroundColor: "black" },
      }}
    >
      <MainFlow />
    </NavigationContainer>
  );
};

export default MainApp = () => {
  const [fontsLoaded] = useFonts({
    "aeonik-regular": require("./assets/fonts/Aeonik-Regular.ttf"),
    "london-regular": require("./assets/fonts/London-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Provider store={store}>
        {__DEV__ && <FlipperAsyncStorage />}
        <StatusBar style="light" />
        <App />
      </Provider>
    </View>
  );
};
