import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import UserPosts from "./UserPosts";
import { useNavigation } from "@react-navigation/native";

const UserWallPage = ({ userAudios, userInfo, userId, storedUserInfo }) => {
  const navigation = useNavigation();

  const handlePress = (listType) => {
    navigation.push("UserListScreen", {
      screenKey: userId,
      listType,
      userId,
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <ProfilePicture userId={userId} imageLink={userInfo.imageLink} />
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
            <TouchableOpacity onPress={() => handlePress("fetchSubscribers")}>
              <View style={styles.bigBox}>
                <Text>Subs:</Text>
                <Text>{userInfo.subscribersCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <UserPosts
        storedUserInfo={storedUserInfo}
        audioList={userAudios}
        userId={userId}
      />
    </View>
  );
};

export default UserWallPage;

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
