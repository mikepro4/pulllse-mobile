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
  Keyboard
} from "react-native";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import MainFlow from "./src/screens/";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Alert from "./src/components/alert";
import config from "./config";
import io from "socket.io-client";

import { togglePlayer, toggleDrawer } from "./src/redux";

import Drawer from "./src/components/drawer";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

import Overlay from "./src/components/drawer/overlay";
import Notification from "./src/components/notification";


const App = () => {

  const [showView, setShowView] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const app = useSelector((state) => state.app);
  const ref = useRef();

  const fetchUserDetails = async () => {
    const userIdFromStorage = await AsyncStorage.getItem("userId");

    if (userIdFromStorage) {
      dispatch(fetchUserInfo({ userId: userIdFromStorage }));
      dispatch(fetchUserAudios({ userId: userIdFromStorage }));
    }
  };

  const socketConnection = async (socket) => {
    const userIdFromStorage = await AsyncStorage.getItem("userId");
    socket.on("connect", () => {
      socket.emit("setUserId", userIdFromStorage);
    });

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
  };

  // useEffect(() => {
  //   fetchUserDetails();

  //   const socket = io(config.apiURL);
  //   socketConnection(socket);
  //   return () => socket.disconnect();
  // }, []);

  useEffect(() => {
    fetchUserDetails();
    const socket = io(config.apiURL);
    socketConnection(socket);
    return () => socket.disconnect();
  }, [storedUserInfo._id]);

  useEffect(() => {
    if (app.drawerOpen && ref && ref.current) {
      const isActive = ref.current.isActive();
      if (isActive) {
        ref.current.scrollTo(0);
      } else {
        ref.current.scrollTo(-SCREEN_HEIGHT / 2);
      }

      let destination;

      switch (app.drawerHeight) {
        case "halfScreen":
          destination = -SCREEN_HEIGHT / 2;
          break;
        case "fullScreen":
          destination = -SCREEN_HEIGHT + 50;
          break;
        case "expanded":
          destination = -SCREEN_HEIGHT / 1.222;
          break;
        default:
          if (typeof app.drawerHeight === "number") {
            destination = -app.drawerHeight;
          }
          break;
      }
      ref.current.scrollTo(destination);
    } else {
      if(ref && ref.current){
        ref.current.scrollTo(0);
      }
    }
  }, [app.drawerOpen]);


  useEffect(() => {
    // Set up keyboard show listener
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('Keyboard is shown');
        if(ref && ref.current){
          ref.current.scrollTo(-SCREEN_HEIGHT / 1.6, true);
        }
        // Your action here
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const close = useCallback(() => {
    dispatch(
      toggleDrawer({ drawerOpen: false, drawerType: null, drawerData: null })
    );
    const isActive = ref.current.isActive();
    if (isActive && app.drawerOpen && ref && ref.current) {
      ref.current.scrollTo(0);
    } else {
      ref.current.scrollTo(-200);
    }
  }, [app.drawerOpen]);

  return (
    <NavigationContainer
      linking={{
        prefixes: ["pulse://"],
        config: {
          screens: {
            Settings: "callback",
          },
        },
      }}
      screenOptions={{
        cardStyle: { backgroundColor: "black" },
      }}
    >
      {showView && <Alert message={message} callback={setShowView} />}

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
    london: require("./assets/fonts/London-Regular.ttf"),
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
