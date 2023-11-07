import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  duration: null,
  type: "recording",
  soundLevels: [],
  link: "",
  fileName: "",
  extencion: "",
};

const pulseRecordingSlice = createSlice({
  name: "pulseRecording",
  initialState,
  reducers: {
    addPulseRecording: (state, action) => {
      state.duration = action.payload.duration;
      state.type = action.payload.type;
      state.soundLevels = action.payload.soundLevels;
      state.link = action.payload.link;
      state.fileName = action.payload.fileName;
      state.extension = action.payload.extension;
    },
  },
});

export const { addPulseRecording } = pulseRecordingSlice.actions;

export const pulseRecordingReducer = pulseRecordingSlice.reducer;
