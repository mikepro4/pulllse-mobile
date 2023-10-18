import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import UserWallPage from "../../components/UserWallPage";
import { fetchUserInfo } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import userApi from "../../redux/axios/userApi";
import FollowUnfollowButton from "../../components/FollowUnfollowButton";

const UserProfileScreen = ({ route }) => {
  const { id } = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [userAudios, setUserAudios] = useState();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  // const userInfo = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Define an async function inside useEffect
      try {
        const response = await userApi.get(`/userinfo/${id}`);
        const responseAudios = await userApi.get(
          `/api/userAudios?userId=${id}`
        );

        setUserAudios(responseAudios.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error("An error occurred while fetching the user info:", error);
      }
    };

    fetchUserInfo(); // Call the async function immediately
  }, [id]);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.h1}>{userInfo.userName}</Text>
        {storedUserInfo._id === id && (
          <Button
            title="Add Friends"
            onPress={() => {
              navigate("AddFriendsScreen");
            }}
          />
        )}
      </View>
      <UserWallPage
        storedUserInfo={storedUserInfo}
        userAudios={userAudios}
        userInfo={userInfo}
        userId={id}
      />
      {/* <FollowUnfollowButton
        item={isFollowing}
        results={[userInfo]}
        setResults={setUserInfo}
      /> */}
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
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
});
