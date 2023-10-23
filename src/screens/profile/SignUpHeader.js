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
import { useNavigation } from "@react-navigation/native";

import Icon from "../../components/icon";
import Logo from "../../components/icon/logo";

import CustomText from "../../components/text";

const NotificationHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ width: 22 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow_back" />
      </TouchableOpacity>

      <View style={{ position: "relative", top: -4 }}>
        <CustomText style={{ fontSize: 16 }}>Sign up</CustomText>
      </View>

      <TouchableOpacity
        style={{ width: 22 }}
        onPress={() => {
          // navigation.navigate("Notifications");
        }}
      >
        {/* <CustomText>Action</CustomText> */}
      </TouchableOpacity>
    </View>
  );
};

export default NotificationHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flex: 1,
  },
});
