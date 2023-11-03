import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mixEnabled: false,
  edited: false,
  originalPulse: null,
  editedPulse: null
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {

    setEdited: (state, action) => {
      state.edited = action.payload;
    },

    toggleMix: (state, action) => {
      state.mixEnabled = action.payload;
    },

    setOriginalPulse: (state, action) => {
      state.originalPulse = action.payload;
    },

    clearPlayer: (state, action) => {
      state.mixEnabled = false,
      state.edited = false,
      state.originalPulse = null,
      state.editedPulse = null
    },

    setPulseTitle: (state, action) => {
      state.editedPulse = {
        ...state.editedPulse,
        title: action.payload
      }
    }
  }
});

export const { 
    toggleMix,
    setEdited,
    setOriginalPulse,
    clearPlayer,
    setPulseTitle
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
