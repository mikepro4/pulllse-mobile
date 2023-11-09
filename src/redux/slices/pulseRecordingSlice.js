import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Audio } from "expo-av";
import {
  loadAudio,
  togglePlayback,
  onSliderValueChange,
} from "../thunks/pulseRecordingThunk";

const initialState = {
  type: "",
  soundLevels: [],
  track: {},
  link: "",
  fileName: "",
  extension: "",
  isPlaying: false,
  isLooping: false,
  sound: null,
  duration: 0,
  playbackPosition: 0,
  bpm: 0,
};

const pulseRecordingSlice = createSlice({
  name: "pulseRecording",
  initialState,

  reducers: {
    setBpm: (state, action) => {
      state.bpm = action.payload;
    },
    setExtencionFilename: (state, action) => {
      state.fileName = action.payload.fileName;
      state.extension = action.payload.extension;
    },
    setSoundLevels: (state, action) => {
      state.soundLevels = action.payload;
    },
    addSoundLevel: (state, action) => {
      if (action.payload.id) {
        state.soundLevels.push(action.payload);
      }
    },
    setIsLooping: (state, action) => {
      state.isLooping = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setSound: (state, action) => {
      state.sound = action.payload;
    },
    setPlaybackPosition: (state, action) => {
      state.playbackPosition = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetPulseRecording: (state) => {
      // Reset each piece of the state individually
      Object.assign(state, initialState);
    },
    addPulseRecording: (state, action) => {
      state.duration = action.payload.duration;
      state.type = action.payload.type;
      state.soundLevels = action.payload.soundLevels;
      state.link = action.payload.link;
      state.fileName = action.payload.fileName;
      state.extension = action.payload.extension;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAudio.pending, (state) => {
        // Handle the loading state if necessary, e.g., setting a flag
      })
      .addCase(loadAudio.fulfilled, (state, action) => {
        // Update the state with the loaded sound and its status
        state.sound = action.payload.sound;
        state.duration = action.payload.status.durationMillis;
        state.type = action.payload.type;
        state.track = action.payload.track;

        // Set other state properties based on the fulfilled action
        state.link = action.payload.link; // If the URI is needed
        // ... set other state properties from the action.payload.status as needed
      })
      .addCase(loadAudio.rejected, (state, action) => {
        // Handle the error state, e.g., resetting the state or setting an error message
      })
      .addCase(togglePlayback.fulfilled, (state, action) => {
        state.isPlaying = action.payload.isPlaying;
      })
      .addCase(onSliderValueChange.fulfilled, (state, action) => {
        state.playbackPosition = action.payload;
      });
  },
});

export const {
  setSoundLevels,
  addSoundLevel,
  addPulseRecording,
  resetPulseRecording,
  setIsPlaying,
  setPlaybackPosition,
  setSound,
  setDuration,
  setIsLooping,
  setExtencionFilename,
  setBpm,
} = pulseRecordingSlice.actions;

export const pulseRecordingReducer = pulseRecordingSlice.reducer;
