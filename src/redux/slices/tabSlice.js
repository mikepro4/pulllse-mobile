import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
  name: "tab",
  initialState: {
    name: "feed",
    player: false,
    resetSroll: false,
    stopScroll: false,
  },
  reducers: {
    switchTab: (state, action) => {
      state.name = action.payload.name;
    },
    resetScroll: (state, action) => {
      state.resetScroll = action.payload;
    },
    stopScroll: (state, action) => {
      state.stopScroll = action.payload;
    },
    togglePlayer: (state, action) => {
      state.player = action.payload;
    },
  },
});

export const { switchTab, togglePlayer, resetScroll, stopScroll } =
  tabSlice.actions;
export const tabReducer = tabSlice.reducer;
