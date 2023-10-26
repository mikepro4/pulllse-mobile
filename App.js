import React, { useState, useEffect, useCallback, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchUserInfo, fetchUserAudios } from "./src/redux";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import MainFlow from "./src/screens/";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { togglePlayer, toggleDrawer } from "./src/redux";

import Drawer from "./src/components/drawer";
import Overlay from "./src/components/drawer/overlay";
import Notification from "./src/components/notification";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const App = () => {
  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const app = useSelector((state) => state.app);
  const ref = useRef()

  const fetchUserDetails = async () => {
    const userIdFromStorage = await AsyncStorage.getItem("userId");
    dispatch(togglePlayer(true));

    if (userIdFromStorage) {
      dispatch(fetchUserInfo({ userId: userIdFromStorage }));
      dispatch(fetchUserAudios({ userId: userIdFromStorage }));
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [storedUserInfo._id]);

  useEffect(() => {
    if (app.drawerOpen) {

      let destination

      switch (app.drawerHeight) {
        case 'halfScreen':
            destination = -SCREEN_HEIGHT / 2
            break
        case 'fullScreen':
            destination = -SCREEN_HEIGHT + 50
            break
        default:
          if (typeof app.drawerHeight === 'number') {
              destination = -app.drawerHeight;
          }
          break;
      }
      ref.current.scrollTo(destination);
    } else {
      ref.current.scrollTo(0);
    }

  }, [app.drawerOpen]);

  return (
    <NavigationContainer
      screenOptions={{
        cardStyle: { backgroundColor: "black" },
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" barStyle="dark-content" position="absolute" top={0} left={0} right={0} />

        {app.drawerOpen && <Overlay/> }
        <Drawer ref={ref} />
        <Notification />

        <MainFlow />
      </GestureHandlerRootView>

    </NavigationContainer>
  );
};

export default MainApp = () => {
  const [fontsLoaded] = useFonts({
    "aeonik-regular": require("./assets/fonts/Aeonik-Regular.ttf"),
    "aeonik-medium": require("./assets/fonts/Aeonik-Medium.ttf"),
    "aeonik-light": require("./assets/fonts/Aeonik-Light.ttf"),
    "london": require("./assets/fonts/London-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "black" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Provider store={store}>
        {__DEV__ && <FlipperAsyncStorage />}
        <App />
      </Provider>
    </View>
  );
};
