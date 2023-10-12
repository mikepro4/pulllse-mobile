import { createSlice } from '@reduxjs/toolkit';

const tabSlice = createSlice({
  name: 'tab',
  initialState: {
    name: 'feed',
    icon: 'mountains'
  }, // Default active tab
  reducers: {
    switchTab: (state, action) => action.payload,
  },
});

export const { switchTab } = tabSlice.actions;
export const tabReducer = tabSlice.reducer;