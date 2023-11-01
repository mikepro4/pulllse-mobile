import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import customMapStyle from "../../components/map/mapStyle";
import AsyncSearch from "../../components/async_search";
import CustomText from "../../components/text";
import SettingsHeader from "../../components/header/settingsHeader";
import PlayerComponent from "../player/PlayerComponent";

const Settings = () => {
  return (
    <View style={{ backgroundColor: "black", flex: 1, paddingTop: 130 }}>
      <View style={styles.header}>
        <SettingsHeader />
      </View>

      <PlayerComponent />
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
