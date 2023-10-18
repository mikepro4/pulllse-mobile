import { View, Text, FlatList, Image, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userApi from "../../redux/axios/userApi";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  console.log("notifications", notifications);
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

  const handleAccept = async (userId, subscriberId, postId) => {
    try {
      // Sending a post request to accept the subscription
      await userApi.post("/acceptSubscription", {
        userId,
        subscriberId,
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

  const handleDecline = async (userId, subscriberId, postId) => {
    try {
      // Sending a post request to accept the subscription
      await userApi.post("/declineSubscription", {
        userId,
        subscriberId,
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
    <View>
      <Text>NotificationsScreen</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 150,
  },
});
