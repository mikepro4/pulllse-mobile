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
