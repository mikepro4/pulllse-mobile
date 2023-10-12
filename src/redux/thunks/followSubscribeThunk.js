import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const followUser = createAsyncThunk(
  "userFollow/follow",
  async (userIdToFollow, { rejectWithValue }) => {
    try {
      const loggedInUserId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/followUser`, {
        userIdToFollow,
        loggedInUserId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export { followUser };
