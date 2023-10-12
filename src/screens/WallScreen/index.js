import { StyleSheet, Text, View, Button, Image } from "react-native";
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
  const userInfo1 = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUserInfo());
      // Return function is the cleanup function, equivalent to componentWillUnmount in class components
      return () => {};
    }, [dispatch])
  );

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <Text style={styles.h1}>WallScreen</Text>
          <Button
            title="Add Friends"
            onPress={() => {
              navigate("AddFriendsScreen");
            }}
          />
        </View>

        <View style={styles.itemsCenter}>
          <ProfilePicture />
          <Text>Username: {userInfo.userName}</Text>

          <View style={styles.infoContainer}>
            <View>
              <Text>Posts:</Text>
              <Text>{userInfo.postsCount}</Text>
            </View>
            <View>
              <Text>Following:</Text>
              <Text>{userInfo.followingCount}</Text>
            </View>
            <View>
              <Text>Followers:</Text>
              <Text>{userInfo.followersCount}</Text>
            </View>
            <View>
              <Text>Subscribers:</Text>
              <Text>{userInfo.subscribersCount}</Text>
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
  itemsCenter: {
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  h1: {
    fontSize: 28,
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 5,
  },
});
