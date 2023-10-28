import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import io from "socket.io-client";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../text";

const Notification = ({ message, callback }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.notificationView}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Notifications"), callback(false);
        }}
      >
        <CustomText style={styles.notificationText}>{message}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notificationView: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "Black",
    alignItems: "center",
    zIndex: 1000,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
  },
});
