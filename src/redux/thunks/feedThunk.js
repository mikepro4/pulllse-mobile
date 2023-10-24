import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchFeed = createAsyncThunk(
  "feed/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.post(`/feed/fetchFeed`, {
        userId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export { fetchFeed };
