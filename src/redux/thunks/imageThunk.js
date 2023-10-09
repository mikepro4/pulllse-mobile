import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uploadImage = createAsyncThunk(
  "image/upload",
  async ({ blob }, thunkAPI) => {
    try {
      const user = await AsyncStorage.getItem("userId");
      // Get the preassigned S3 URL for image
      const response = await userApi.get(`/api/createImage?userId=${user}`);
      const { url, key } = response.data;

      await axios.put(url, blob, {
        headers: {
          "Content-Type": "image/jpeg", // adjust this depending on the image format
        },
      });
      const finalUrl =
        "https://my-photo-bucket-111.s3.us-east-2.amazonaws.com/" + key;
      await userApi.post("/api/saveImageLink", {
        imageLink: finalUrl,

        user,
      });
      return finalUrl;
    } catch (error) {
      console.log("Error in uploadImage action:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const fetchUserImage = createAsyncThunk("image/fetch", async (_, thunkAPI) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    const response = await userApi.get(`/api/userImages?userId=${userId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const deleteImage = createAsyncThunk("image/delete", async (key, thunkAPI) => {
  try {
    await userApi.post("/api/deleteImage", { key });
    return key; // return the key of deleted image to handle it in the reducer
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export { uploadImage, fetchUserImage, deleteImage };
