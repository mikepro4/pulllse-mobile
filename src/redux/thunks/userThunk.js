import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tryLocalSignIn = createAsyncThunk("user/tryLocalSignIn", async () => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    return token;
  } else {
    throw new Error("No token found.");
  }
});

const signup = createAsyncThunk(
  "user/signup",
  async ({ email, password, userName, navigation }, { rejectWithValue }) => {
    console.log(userName);
    try {
      const response = await userApi.post("/signup", {
        email,
        password,
        userName,
      });
      console.log("signup response", response.data);

      // Set the token in AsyncStorage
      await AsyncStorage.setItem("token", response.data.token);

      // Set the user's ID in AsyncStorage
      await AsyncStorage.setItem("userId", response.data.userId);
      navigation.goBack();
      console.log("response.data.token", response.data.token);
      // Return the token for further processing or usage in reducers
      return response.data.token;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong with sign up");
    }
  }
);

const signin = createAsyncThunk(
  "user/signin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/signin", { email, password });

      // Set the token in AsyncStorage
      await AsyncStorage.setItem("token", response.data.token);

      // Set the user's ID in AsyncStorage
      await AsyncStorage.setItem("userId", response.data.userId);

      // Return the token for further processing or usage in reducers
      return response.data.token;
    } catch (err) {
      throw new Error("Something went wrong with sign in");
    }
  }
);

const signout = createAsyncThunk(
  "user/signout",
  async (_, { rejectWithValue }) => {
    await AsyncStorage.removeItem("token");

    return null;
  }
);

const fetchUserInfo = createAsyncThunk("user/fetchUserInfo", async () => {
  const userId = await AsyncStorage.getItem("userId");
  const response = await userApi.get(`/userinfo/${userId}`);
  return response.data;
});

export { signin, signout, signup, tryLocalSignIn, fetchUserInfo };
