import { Provider } from "react-redux";
import { store } from "./src/redux";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import FeedScreen from "./src/screens/FeedScreen";
import WallScreen from "./src/screens/WallScreen";
import AddPulseScreen from "./src/screens/AddPulseScreen";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const LoginStack = () => (
  <Stack.Navigator options={{ headerShown: false }}>
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
const MainFlow = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="FeedScreen"
      component={FeedScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="AddPulseScreen"
      component={AddPulseScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="WallScreen"
      component={WallScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="ResolveAuth"
      screenOptions={{
        animation: "none",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="ResolveAuth"
        component={ResolveAuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginFlow"
        component={LoginStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainFlow"
        component={MainFlow}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SafeAreaProvider>
  );
};
