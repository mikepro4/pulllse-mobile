import React, { useState, useEffect, useCallback } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/redux";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import "react-native-devsettings";

import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

import MainFlow from "./src/screens/"

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
      cardStyle: { backgroundColor: 'transparent' },
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


const App = () => (
  <NavigationContainer
    screenOptions={{
      cardStyle: { backgroundColor: 'black' },
    }}
  >
    <MainFlow />
  </NavigationContainer>
)




export default MainApp = () => {
  const [fontsLoaded] = useFonts({
    'aeonik-regular': require('./assets/fonts/Aeonik-Regular.ttf'),
    'london-regular': require('./assets/fonts/London-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
          {__DEV__ && <FlipperAsyncStorage />}
          <StatusBar style="light" />
          <App />

      </Provider>
    </SafeAreaProvider>
  );
};
