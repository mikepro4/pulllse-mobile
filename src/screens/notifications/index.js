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

  const handleSeen = async (notificationId) => {
    try {
      await userApi.post("/markNotificationSeen", {
        notificationId,
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const buttonSwitch = (item) => {
    switch (item.type) {
      case "follow":
        return (
          <Button
            title="Mark as seen"
            onPress={() => handleSeen(item._id)}
            color="green"
          />
        );
      case "subscription_request":
        return (
          <>
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
          </>
        );
    }
  };

  const textSwitch = (item) => {
    switch (item.type) {
      case "follow":
        return (
          <CustomText>{item.from.userName} is now following you</CustomText>
        );
      case "subscription_request":
        return (
          <CustomText>
            {item.from.userName} sent you a subscription request
          </CustomText>
        );
    }
  };

  const humanReadableDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "yesterday";
    } else {
      // Here, you can format the date as desired for dates other than today and yesterday
      // For simplicity, this example returns the date in the format 'DD/MM/YYYY'
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  const NotificationItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.userIconWithTextContainer}>
        <Image source={{ uri: item.from.imageLink }} style={styles.userImage} />
        <View style={styles.textContainer}>{textSwitch(item)}</View>
      </View>
      <View style={styles.buttonContainer}>{buttonSwitch(item)}</View>
      <View style={styles.textContainer}>
        <CustomText style={{ color: "#fff696" }}>
          {humanReadableDate(item.date)}
        </CustomText>
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
