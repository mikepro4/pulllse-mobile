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

import Icon from "../icon";
import Logo from "../icon/logo";

const ProfileHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        {/* <Icon name="map" /> */}
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Icon name="cog" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flex: 1,
  },
});
