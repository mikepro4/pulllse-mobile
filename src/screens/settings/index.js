import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import customMapStyle from "../../components/map/mapStyle";
import AsyncSearch from "../../components/async_search";
import CustomText from "../../components/text";
import SettingsHeader from "../../components/header/settingsHeader";
import PlayerComponent from "../player/PlayerComponent";
import InAppBrowser from "react-native-inappbrowser-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignInWithService from "./SignInWithService";

const Settings = ({ route }) => {
  console.log(route.params?.access_token);
  console.log(route.params?.refresh_token);
  console.log("expires_in", route.params?.expires_in);

  const setSpotifyStorage = async ({ access, refresh, expires_in }) => {
    if (access) {
      await AsyncStorage.setItem("accessToken", access);
    }
    if (expires_in) {
      await AsyncStorage.setItem("expiresIn", expires_in);
    }
    if (refresh) {
      await AsyncStorage.setItem("refreshToken", refresh);
    }
  };

  useEffect(() => {
    setSpotifyStorage({
      access: route.params?.access_token,
      refresh: route.params?.refresh_token,
      expires_in: route.params?.expires_in,
    });
  }, [route.params]);

  if (route.params?.access_token && route.params?.refresh_token) {
    InAppBrowser.close();
  }
  return (
    <View style={{ backgroundColor: "black", flex: 1, paddingTop: 130 }}>
      <View style={styles.header}>
        <SettingsHeader />
      </View>

      <SignInWithService />
    </View>
  );
};

const styles = StyleSheet.create({
  userIconWithTextContainer: {
    alignItems: "center", // centers items horizontally
    justifyContent: "start", // centers items vertically
    flexDirection: "row",
  },
  userImage: { width: 30, height: 30, borderRadius: 1000 },
  textContainer: {
    paddingLeft: 10,
  },
  notificationContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default Settings;
