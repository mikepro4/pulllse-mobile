import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import ProfilePicture from "../../components/profile_picture";
import UserPosts from "./UserPosts";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../../components/text";

const UserWall = ({ userAudios, userInfo, userId, storedUserInfo }) => {
  const navigation = useNavigation();
  const handlePress = (listType) => {
    navigation.push("UserListScreen", {
      screenKey: userId,
      listType,
      userId,
    });
  };
  console.log("userInfo", userInfo);

  return (
    <View>
      <View style={styles.container}>
        <ProfilePicture userId={userId} imageLink={userInfo.imageLink} />
        <View style={styles.itemsCenter}>
          <View style={styles.infoContainer}>
            <View style={styles.lilBox}>
              <CustomText>Posts:</CustomText>
              <CustomText>{userInfo.postsCount}</CustomText>
            </View>
            <TouchableOpacity onPress={() => handlePress("fetchFollowing")}>
              <View style={styles.lilBox}>
                <CustomText>Following:</CustomText>
                <CustomText>{userInfo.followingCount}</CustomText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress("fetchFollowers")}>
              <View style={styles.lilBox}>
                <CustomText>Followers:</CustomText>
                <CustomText>{userInfo.followersCount}</CustomText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => handlePress("fetchSubscribing")}>
              <View style={styles.lilBox}>
                <CustomText>Subscribing:</CustomText>
                <CustomText>{userInfo.subscriptionsCount}</CustomText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress("fetchSubscribers")}>
              <View style={styles.lilBox}>
                <CustomText>Subscribers:</CustomText>
                <CustomText>{userInfo.subscribersCount}</CustomText>
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

export default UserWall;

const styles = StyleSheet.create({
  bigBox: {
    alignItems: "center",
  },
  lilBox: {
    borderRightWidth: 1,
    borderColor: "black",
    alignItems: "center",
    maxWidth: 100,
    justifyContent: "center",
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
  },
  h1: {
    marginLeft: 20,
    fontSize: 28,
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRightWidth: 0,
  },
});
