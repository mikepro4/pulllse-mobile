import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signout } from "../../redux";

import React, { useState, useEffect, useCallback } from "react";
import ProfilePicture from "../../components/ProfilePicture";
import UserPosts from "../../components/UserPosts";
import UserWallPage from "../../components/UserWallPage";

import { useNavigation } from "@react-navigation/native";
import { fetchUserInfo, fetchUserAudios } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WallScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  const audioList = useSelector((state) => state.audio.recordings);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserDetails = async () => {
        const userIdFromStorage = await AsyncStorage.getItem("userId"); // Retrieving userId from AsyncStorage

        if (userIdFromStorage) {
          dispatch(fetchUserInfo({ userId: userIdFromStorage })); // Passing userId as an argument to your action
          dispatch(fetchUserAudios({ userId: userIdFromStorage }));
          setUserId(userIdFromStorage); // 2. Update the userId state
        } else {
          console.error("UserId not found in AsyncStorage");
        }
      };

      fetchUserDetails();

      return () => {}; // Cleanup function
    }, [dispatch])
  );

  const handlePress = (listType) => {
    navigate("UserListScreen", { listType });
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.h1}>{storedUserInfo.userName}</Text>
        {storedUserInfo._id === userId && (
          <Button
            title="Add Friends"
            onPress={() => {
              navigate("AddFriendsScreen");
            }}
          />
        )}
      </View>
      <UserWallPage
        userAudios={audioList}
        userInfo={storedUserInfo}
        userId={storedUserInfo._id}
        storedUserInfo={storedUserInfo._id}
      />
      <Button
        title="Notifications"
        onPress={() => {
          navigate("NotificationsScreen");
        }}
      />

      <Button
        title="Sign Out"
        onPress={() => {
          dispatch(signout({ navigate }));
        }}
      />
    </SafeAreaView>
  );
};

export default WallScreen;

const styles = StyleSheet.create({
  bigBox: {
    alignItems: "center",
  },
  lilBox: {
    borderRightWidth: 1,
    borderColor: "black",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    marginLeft: 10,
    gap: 10,
    marginBottom: 25,
  },
  itemsCenter: {
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
  },
  h1: {
    marginLeft: 20,
    fontSize: 28,
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 5,
    borderWidth: 1,
    borderColor: "black",
  },
});
