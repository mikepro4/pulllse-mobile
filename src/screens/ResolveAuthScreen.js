import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { tryLocalSignIn } from "../redux"; // Ensure the correct path
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResolveAuthScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const getToken = async () => {
    const token = await AsyncStorage.getItem("token");
    return token;
  };
  console.log("token:", getToken());

  // const token = useSelector((state) => state.user.token); // Assuming state structure

  useEffect(() => {
    dispatch(tryLocalSignIn({ navigate }));
  }, []);

  return null;
};

export default ResolveAuthScreen;
