import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../axios/userApi";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uploadAudio = createAsyncThunk("audio/upload", async (blob, thunkAPI) => {
  console.log("uploadAudio action called");
  try {
    const userId = await AsyncStorage.getItem("userId");
    // Get the preassigned S3 URL
    const response = await userApi.get("http://localhost:4000/api/upload");
    const { url } = response.data;

    // Upload the audio file to the preassigned S3 link
    await axios.put(url, blob, {
      headers: {
        "Content-Type": "audio/x-m4a",
      },
    });

    //   await audioApi.post("http://localhost:4000/api/saveAudioLink", {
    //     audioLink: url,
    //     name,
    //     userId,
    //   });
    return url;
  } catch (error) {
    console.log("Error in uploadAudio action:", error); // <-- Add this
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const fetchUserAudios = createAsyncThunk(
  "audio/fetch",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.get("/api/userAudios");

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export { uploadAudio, fetchUserAudios };
