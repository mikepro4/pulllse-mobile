import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tryLocalSignIn = createAsyncThunk(
  "user/tryLocalSignIn",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      return token;
    } else {
      throw new Error("No token found.");
    }
  }
);

const signup = createAsyncThunk(
  "user/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/signup", { email, password });

      // Set the token in AsyncStorage
      await AsyncStorage.setItem("token", response.data.token);

      // Set the user's ID in AsyncStorage
      await AsyncStorage.setItem("userId", response.data.userId);

      // Return the token for further processing or usage in reducers
      return response.data.token;
    } catch (err) {
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

export { signin, signout, signup, tryLocalSignIn };
