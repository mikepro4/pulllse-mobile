import { View, Text, FlatList, Image, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import CustomText from "../../components/text";
import userApi from "../../redux/axios/userApi";
import { useSelector } from "react-redux";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import Theme from "../../styles/theme";
import NotificationHeader from "../../components/header/notificationHeader";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  console.log("storedUserInfo", storedUserInfo._id);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userApi.get(
          `/fetchNotifications?userId=${storedUserInfo._id}`
        );

        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (userId, targetUserId, postId) => {
    try {
      // Sending a post request to accept the subscription
      await userApi.post("/acceptSubscription", {
        userId,
        targetUserId,
        postId,
      });

      // Updating the notifications state by filtering out the accepted notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== postId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (userId, targetUserId, postId) => {
    try {
      // Sending a post request to accept the subscription
      await userApi.post("/declineSubscription", {
        userId,
        targetUserId,
        postId,
      });

      // Updating the notifications state by filtering out the accepted notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== postId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const NotificationItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Image source={{ uri: item.from.imageLink }} style={styles.userImage} />
      <View style={styles.textContainer}>
        <Text>{item.from.userName}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Accept"
          onPress={() =>
            handleAccept(storedUserInfo._id, item.from._id, item._id)
          }
          color="green"
        />
        <Button
          title="Decline"
          onPress={() =>
            handleDecline(storedUserInfo._id, item.from._id, item._id)
          }
          color="red"
        />
      </View>
    </View>
  );
  return (
    <View style={{ backgroundColor: "black", flex: 1, paddingTop: 130 }}>
      <View style={styles.header}>
        <NotificationHeader />
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Notifications;

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
