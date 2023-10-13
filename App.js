import React, { useState, useEffect, useCallback } from 'react';
import { Provider } from "react-redux";
import { store } from "./src/redux";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
      cardStyle: { backgroundColor: 'transparent' },
    }}
  >
    <Stack.Navigator
      initialRouteName="ResolveAuth"
      screenOptions={{
        animation: "none",
        gestureEnabled: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen
        name="ResolveAuth"
        component={ResolveAuthScreen}
        options={{ headerShown: false }}
        screenOptions={{
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="LoginFlow"
        component={LoginStack}
        options={{ headerShown: false }}
        screenOptions={{
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="MainFlow"
        component={MainFlow}
        options={{ headerShown: false, cardStyle: { backgroundColor: '#000000', flex: 1 }, }}
      />
    </Stack.Navigator>
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

          <StatusBar style="light" />
          <App />

      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    color: '#ffffff',
    backgroundColor: '#000000'
  }
})
