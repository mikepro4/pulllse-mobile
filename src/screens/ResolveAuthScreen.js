import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { tryLocalSignIn } from "../redux"; // Ensure the correct path

const ResolveAuthScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token); // Assuming state structure

  useEffect(() => {
    // Dispatch the thunk
    dispatch(tryLocalSignIn());

    // Navigate based on the presence of the token
    if (token) {
      navigate("MainFlow", { screen: "FeedScreen" }); // Update with your route name
    } else {
      navigate("LoginFlow"); // Update with your route name
    }
  }, [token, dispatch, navigate]);

  return null;
};

export default ResolveAuthScreen;
