import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import io from "socket.io-client";

const Notification = () => {
  return (
    <View style={styles.notificationView}>
      <Text style={styles.notificationText}>New Notification!</Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notificationView: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "red",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 16,
  },
});
