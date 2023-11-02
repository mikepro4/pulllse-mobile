import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mixEnabled: false,
  edited: false,
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
  }
});

export const { 
    toggleMix,
    setEdited
} = playerSlice.actions;

export const playerReducer = playerSlice.reducer;
