import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { tryLocalSignIn } from "../redux"; // Ensure the correct path

const ResolveAuthScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token); // Assuming state structure

  useEffect(() => {
    dispatch(tryLocalSignIn({ navigate }));
  }, []);

  return null;
};

export default ResolveAuthScreen;
