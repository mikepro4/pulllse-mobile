import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { signout } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, fetchUserAudios } from "../../redux";
import { useFocusEffect } from "@react-navigation/native";
import UserWall from "./UserWall";

const UserPage = () => {
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const audioList = useSelector((state) => state.audio.recordings);
  console.log("storedUserInfo._id", storedUserInfo._id);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userIdFromStorage = await AsyncStorage.getItem("userId"); // Retrieving userId from AsyncStorage
      console.log("userIdFromStorage", userIdFromStorage);
      if (userIdFromStorage) {
        dispatch(fetchUserInfo({ userId: userIdFromStorage })); // Passing userId as an argument to your action
        dispatch(fetchUserAudios({ userId: userIdFromStorage }));
        setUserId(userIdFromStorage); // 2. Update the userId state
      } else {
        console.error("UserId not found in AsyncStorage");
      }
    };

    fetchUserDetails();
  }, [storedUserInfo._id]);

  return (
    <View>
      <UserWall
        userAudios={audioList}
        userInfo={storedUserInfo}
        userId={storedUserInfo._id}
        storedUserInfo={storedUserInfo._id}
      />
      <Button
        title="Sign Out"
        onPress={() => {
          dispatch(signout());
        }}
      />
    </View>
  );
};

export default UserPage;

const styles = StyleSheet.create({});
