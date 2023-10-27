import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mixEnabled: false,
  postScreen: false,
  postScreenSuccess: false,
  activeLayer: 0,
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
    setLayers: (state, action) => {
        state.originalLayers = action.payload;
        state.editedLayers = action.payload;
    },
    changeLayerParam: (state, action) => {
      console.log(action.payload)
      // state.mixEnabled = action.payload;
    },
    setActiveLayer: (state, action) => {
      state.activeLayer = action.payload;
  },
  }
});

export const { 
    toggleMix, 
    togglePostScreen,
    togglePostScreenSuccess,
    setLayers,
    changeLayerParam,
    setActiveLayer
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
