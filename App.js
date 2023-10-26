import React, { useState, useEffect, useCallback, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, fetchUserInfo, fetchUserAudios } from "./src/redux";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import MainFlow from "./src/screens/";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Notification from "./src/components/notification";
import config from "./config";
import io from "socket.io-client";

import { togglePlayer, toggleDrawer } from "./src/redux";

import Drawer from "./src/components/drawer";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const App = () => {
  const [showView, setShowView] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const app = useSelector((state) => state.app);
  const ref = useRef();

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

    const socket = io(config.apiURL);

    socket.on("connect_error", (error) => {
      console.error("Socket Connection Error:", error);
    });

    socket.on("notification", (message) => {
      setShowView(true);
      setMessage(message.message);
      setTimeout(() => {
        setShowView(false);
      }, 5000); // Hide the view after 5 seconds
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [storedUserInfo._id]);

  useEffect(() => {
    if (app.drawerOpen) {
      const isActive = ref.current.isActive();
      if (isActive) {
        ref.current.scrollTo(0);
      } else {
        ref.current.scrollTo(-SCREEN_HEIGHT / 2);
      }
    }
  }, [app.drawerOpen]);

  const close = useCallback(() => {
    dispatch(
      toggleDrawer({ drawerOpen: false, drawerType: null, drawerData: null })
    );
    const isActive = ref.current.isActive();
    if (isActive) {
      ref.current.scrollTo(0);
    } else {
      ref.current.scrollTo(-200);
    }
  }, []);

  return (
    <NavigationContainer
      screenOptions={{
        cardStyle: { backgroundColor: "black" },
      }}
    >
      {showView && <Notification message={message} callback={setShowView} />}

      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          style="light"
          barStyle="dark-content"
          position="absolute"
          top={0}
          left={0}
          right={0}
        />

        {app.drawerOpen && (
          <TouchableOpacity
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            onPress={close}
          />
        )}
        <Drawer ref={ref}>
          <ScrollView style={{ flex: 1, height: 3000 }}>
            <Text style={{ color: "white", paddingHorizontal: 20 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabre,
              nulla non pvel pellentesque ipsum tellus vitae ex. Nullam
              fringilla, dui vitae euismod placerat, ligula tortor aliquam urna,
              sit amet rutrum arcu turpis non ex.
            </Text>
          </ScrollView>
        </Drawer>

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
    "london-regular": require("./assets/fonts/London-Regular.ttf"),
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
