import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tab',
  initialState: {
    name: 'feed',
    player: false
  }, 
  reducers: {
    switchTab: (state, action) => {
      state.name = action.payload.name;
    },
    togglePlayer: (state, action) => {
      state.player = action.payload;
    },
  },
});

export const { switchTab, togglePlayer } = tabSlice.actions;
export const tabReducer = tabSlice.reducer;