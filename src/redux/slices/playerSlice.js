import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mixEnabled: false,
  postScreen: false,
  postScreenSuccess: false,
  activeLayer: 0,
  originalLayers: [
  ],
  editedLayers: [
    {
      algorithm: 1,
      position: 0,
      params: {
        frequency: 0.1,
        step: 0.1,
        rotation: 0.1,
        boldness: 0.1
      }
    },
    {
      algorithm: 1,
      position: 1,
      params: {
        frequency: 0.2,
        step: 0.2,
        rotation: 0.2,
        boldness: 0.2
      }
    },
    {
      algorithm: 1,
      position: 2,
      params: {
        frequency: 0.3,
        step: 0.3,
        rotation: 0.3,
        boldness: 0.3
      }
    },
    {
      algorithm: 1,
      position: 3,
      params: {
        frequency: 0.4,
        step: 0.4,
        rotation: 0.4,
        boldness: 0.4
      }
    }
  ]
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
    updateLayer: (state, action) => {
      state.mixEnabled = action.payload;
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
