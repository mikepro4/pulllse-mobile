import { createSlice } from "@reduxjs/toolkit";
import {
  uploadAudio,
  fetchUserAudios,
  deleteAudio,
  loadPostAudio,
  togglePostPlayback,
  onPostSliderValueChange,
} from "../thunks/audioThunk";

const initialState = {
  recordings: [],
  isPlaying: false,
  sound: null,
  duration: 0,
  playbackPosition: 0,
  audios: [],
  status: "idle",
  error: null,
};

const recordingsSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addRecording: (state, action) => {
      state.audios.push(action.payload);
    },
    setPostIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
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
      })
      .addCase(loadPostAudio.pending, (state) => {
        // Handle the loading state if necessary, e.g., setting a flag
      })
      .addCase(loadPostAudio.fulfilled, (state, action) => {
        // Update the state with the loaded sound and its status
        state.sound = action.payload.sound;
        state.duration = action.payload.status.durationMillis;
      })
      .addCase(loadPostAudio.rejected, (state, action) => {
        // Handle the error state, e.g., resetting the state or setting an error message
      })
      .addCase(togglePostPlayback.fulfilled, (state, action) => {
        state.isPlaying = action.payload.isPlaying;
      })
      .addCase(onPostSliderValueChange.fulfilled, (state, action) => {
        state.playbackPosition = action.payload;
      });
  },
});

export const { addRecording, setPostIsPlaying } = recordingsSlice.actions;

export const recordsReducer = recordingsSlice.reducer;
