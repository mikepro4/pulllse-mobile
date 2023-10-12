import { Provider } from "react-redux";
import { store } from "./src/redux";
import { StyleSheet, View } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import FeedScreen from "./src/screens/FeedScreen";
import WallScreen from "./src/screens/WallScreen";
import AddPulseScreen from "./src/screens/AddPulseScreen";

import MainFlow from "./src/screens/"

import { StatusBar } from "expo-status-bar";


import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

const Tab = createBottomTabNavigator();
// const MainFlow = () => (
//   <Tab.Navigator
//     screenOptions={{
//       tabBarStyle: { backgroundColor: 'transparent' }, // Add this line
//     }}
//   >
//     <Tab.Screen
//       name="FeedScreen"
//       component={FeedScreen}
//       options={{ headerShown: false, cardStyle: { backgroundColor: '#000000', flex: 1 }, }}
//     />
//     <Tab.Screen
//       name="AddPulseScreen"
//       component={AddPulseScreen}
//       options={{ headerShown: false }}
//       screenOptions={{
//         cardStyle: { backgroundColor: 'transparent' },
//       }}
//     />
//     <Tab.Screen
//       name="WallScreen"
//       component={WallScreen}
//       options={{ headerShown: false }}
//       screenOptions={{
//         cardStyle: { backgroundColor: 'transparent' },
//       }}
//     />
//   </Tab.Navigator>
// );

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
);

export default () => {
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
