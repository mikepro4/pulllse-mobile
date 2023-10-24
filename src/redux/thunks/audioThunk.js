import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uploadAudio = createAsyncThunk(
  "audio/upload",
  async ({ blob, duration, callback }, thunkAPI) => {
    try {
      const user = await AsyncStorage.getItem("userId");
      // Get the preassigned S3 URL
      const response = await userApi.get(`/api/upload?userId=${user}`);
      const { url, key } = response.data;

      // Upload the audio file to the preassigned S3 link
      await axios.put(url, blob, {
        headers: {
          "Content-Type": "audio/x-m4a",
        },
      });
      const finalUrl =
        "https://my-audio-bucket-111.s3.us-east-2.amazonaws.com/" + key;
      const audioObject = await userApi.post("/api/saveAudioLink", {
        audioLink: finalUrl,
        duration,
        user,
      });
      if (audioObject && audioObject.data && callback) {
        callback(audioObject.data);
      }
      return audioObject.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const fetchUserAudios = createAsyncThunk(
  "audio/fetch",
  async ({ userId }, thunkAPI) => {
    try {
      // const userId = await AsyncStorage.getItem("userId");
      const response = await userApi.get(`/api/userAudios?userId=${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const deleteAudio = createAsyncThunk(
  "audio/delete",
  async ({ key, link }, thunkAPI) => {
    try {
      const user = await AsyncStorage.getItem("userId");
      await userApi.post("/api/deleteAudio", { key, user });

      return link; // return the key of deleted audio to handle it in the reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export { uploadAudio, fetchUserAudios, deleteAudio };
