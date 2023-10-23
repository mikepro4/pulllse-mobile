import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import UserWall from "./UserWall";
import { useSelector } from "react-redux";
import userApi from "../../redux/axios/userApi";
import FollowUnfollowButton from "../../components/follow_unfollow_button";

const UserProfileScreen = ({ route }) => {
  const { id, item } = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [userAudios, setUserAudios] = useState();
  const storedUserInfo = useSelector((state) => state.user.userInfo);
  const [userButton, setUserButton] = useState([item]);

  useEffect(() => {
    const fetchUserInfo = async () => {
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

    fetchUserInfo();
  }, [id]);

  return (
    <>
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
      <UserWall
        storedUserInfo={storedUserInfo}
        userAudios={userAudios}
        userInfo={userInfo}
        userId={id}
      />
      <FollowUnfollowButton
        item={userButton[0]}
        results={userButton}
        setResults={setUserButton}
      />
    </>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
    marginTop: 150,
  },
  h1: {
    marginLeft: 20,
    fontSize: 28,
  },
});
