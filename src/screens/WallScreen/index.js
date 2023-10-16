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

import { useNavigation } from "@react-navigation/native";
import { fetchUserInfo } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const WallScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const userInfo = useSelector((state) => state.user.userInfo);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUserInfo());

      // Return function is the cleanup function, equivalent to componentWillUnmount in class components
      return () => {};
    }, [dispatch])
  );

  const handlePress = (listType) => {
    navigate("UserListScreen", { listType });
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <Text style={styles.h1}>{userInfo.userName}</Text>
          <Button
            title="Add Friends"
            onPress={() => {
              navigate("AddFriendsScreen");
            }}
          />
        </View>
        <View style={styles.container}>
          <ProfilePicture imageLink={userInfo.imageLink} />
          <View style={styles.itemsCenter}>
            <View style={styles.infoContainer}>
              <View style={styles.lilBox}>
                <Text>Posts:</Text>
                <Text>{userInfo.postsCount}</Text>
              </View>

              <TouchableOpacity onPress={() => handlePress("fetchFollowing")}>
                <View style={styles.lilBox}>
                  <Text>Following:</Text>
                  <Text>{userInfo.followingCount}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress("fetchFollowers")}>
                <View style={styles.lilBox}>
                  <Text>Followers:</Text>
                  <Text>{userInfo.followersCount}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePress("fetchFollowers")}>
                <View style={styles.bigBox}>
                  <Text>Subs:</Text>
                  <Text>{userInfo.subscribersCount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <UserPosts />
        <Button
          title="Sign Out"
          onPress={() => {
            dispatch(signout({ navigate }));
          }}
          style={styles.signOut}
        />
      </View>
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
