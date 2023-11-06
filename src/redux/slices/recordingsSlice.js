import { createSlice } from "@reduxjs/toolkit";
import {
  uploadAudio,
  fetchUserAudios,
  deleteAudio,
} from "../thunks/audioThunk";

const initialState = {
  recordings: [],
  audios: [],
  status: "idle", // to track the request status
  error: null,
};

const recordingsSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addRecording: (state, action) => {
      state.audios.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAudio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recordings = [...state.recordings, action.payload];
      })
      .addCase(uploadAudio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserAudios.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserAudios.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recordings = action.payload;
      })
      .addCase(fetchUserAudios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteAudio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAudio.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recordings = state.recordings.filter(
          (recording) => recording.audioLink !== action.payload
        );
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addRecording } = recordingsSlice.actions;

export const recordsReducer = recordingsSlice.reducer;
