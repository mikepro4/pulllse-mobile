import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mixEnabled: true,
  postScreen: false,
  postScreenSuccess: false,
  originalLayers: [],
  editedLayers: []
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    toggleMix: (state, action) => {
      state.mixEnabled = action.payload;
    },
    togglePostScreen: (state, action) => {
        state.postScreen = action.payload;
    },
    togglePostScreenSuccess: (state, action) => {
        state.postScreenSuccess = action.payload;
    },
    setOriginalLayers: (state, action) => {
        state.originalLayers = action.payload;
    },
    setEditedLayers: (state, action) => {
        state.editedLayers = action.payload;
    },
  }
});

export const { 
    toggleMix, 
    togglePostScreen,
    togglePostScreenSuccess,
    setOriginalLayers, 
    setEditedLayers 
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
