import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import CustomText from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { tryLocalSignIn } from "../../redux";
import { useNavigation } from "@react-navigation/native";
import SignIn from "./SignIn";
import UserPage from "./UserPage";

const ProfilePage = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  return (
    <View style={{ paddingTop: 120 }}>
      {token ? <UserPage /> : <SignIn navigate={navigate} />}
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({});
