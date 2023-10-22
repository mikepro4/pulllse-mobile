import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const followUser = createAsyncThunk(
  "userFollow/follow",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/followUser`, {
        targetUserId,
        userId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const unfollowUser = createAsyncThunk(
  "userFollow/unfollow",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/unfollowUser`, {
        targetUserId,
        userId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const subscribeUser = createAsyncThunk(
  "userSubscribe/subscribe",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/sendSubscriptionRequest`, {
        userId, // the user you want to subscribe to
        targetUserId, // the logged-in user who wants to subscribe
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const unsubscribeUser = createAsyncThunk(
  "userSubscribe/unsubscribe",
  async (targetUserId, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/unsubscribeUser`, {
        userId,
        targetUserId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export { followUser, unfollowUser, subscribeUser, unsubscribeUser };
