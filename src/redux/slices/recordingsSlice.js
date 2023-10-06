import { createSlice } from "@reduxjs/toolkit";
import { uploadAudio, fetchUserAudios } from "../thunks/audioThunk";

const initialState = {
  recordings: [],
  status: "idle", // to track the request status
  error: null,
};

const recordingsSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addRecording: (state, action) => {
      state.recordings.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAudio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If you want to update some part of state when audio upload is successful, do it here
        // Example: state.uploadedUrl = action.payload;
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
        state.recordings = state.recordings.concat(action.payload);
      })
      .addCase(fetchUserAudios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addRecording } = recordingsSlice.actions;

export const recordsReducer = recordingsSlice.reducer;
