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

const unfollowUser = createAsyncThunk(
  "userFollow/unfollow",
  async (userIdToUnfollow, { rejectWithValue }) => {
    try {
      const loggedInUserId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/unfollowUser`, {
        userIdToUnfollow,
        loggedInUserId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export { followUser, unfollowUser };
