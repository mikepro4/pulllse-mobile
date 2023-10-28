import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
  name: "tab",
  initialState: {
    name: "feed",
    player: false,
    map: false,
    resetSroll: false,
  },
  reducers: {
    switchTab: (state, action) => {
      state.name = action.payload.name;
    },
    resetScroll: (state, action) => {
      state.resetScroll = action.payload;
    },
    togglePlayer: (state, action) => {
      state.player = action.payload;
    },
    toggleMap: (state, action) => {
      state.map = action.payload;
    },
  },
});

export const { switchTab, togglePlayer, resetScroll, toggleMap } =
  tabSlice.actions;
export const tabReducer = tabSlice.reducer;
