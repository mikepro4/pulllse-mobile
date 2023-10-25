import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { togglePlayer } from "../../redux/slices/tabSlice";
import CustomText from "../text";
import Icon from "../icon";
import MainHeader from "./mainHeader";
import ProfileHeader from "./profileHeader";

const Header = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();

  let renderedHeader;

  if (!activeTab.player) {
    switch (activeTab.name) {
      case "feed":
        renderedHeader = <MainHeader />;
        break;
      case "x":
        renderedHeader = <CustomText>X</CustomText>;
        break;
      case "search":
        renderedHeader = <CustomText>Search</CustomText>;
        break;
      case "profile":
        renderedHeader = <ProfileHeader />;
        break;
      default:
        renderedHeader = <View />;
        break;
    }
  } else {
    return ;
  }
  return <View style={styles.header}>{renderedHeader}</View>;
};

export default Header;

const styles = StyleSheet.create({
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
