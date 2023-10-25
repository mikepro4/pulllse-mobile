import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
  name: "tab",
  initialState: {
    name: "feed",
    player: false,
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
  },
});

export const { switchTab, togglePlayer, resetScroll } =
  tabSlice.actions;
export const tabReducer = tabSlice.reducer;
