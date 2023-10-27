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
      const layers = state.editedLayers
      const activeLayer = state.editedLayers.filter(item => item.position === state.activeLayer);
      let newLayer
      if(activeLayer[0]) {
        newLayer = {
          ...activeLayer[0],
          params: {
            ...activeLayer[0].params,
            [action.payload.paramName]: 
              action.payload.direction === "up" ? activeLayer[0].params[action.payload.paramName] + action.payload.valueChange 
              : activeLayer[0].params[action.payload.paramName] - action.payload.valueChange
          }
        }
      }

      const updatedLayers = layers.map(layer => {
        if (layer.position === state.activeLayer) {
            return newLayer;
        }
        return layer;
      });

      state.editedLayers = updatedLayers;

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
