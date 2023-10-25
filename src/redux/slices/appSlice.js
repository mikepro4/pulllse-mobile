import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  drawerType: null,
  drawerData: null
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDrawer: (state, action) => {
      state.drawerOpen = action.payload.drawerOpen;
      state.drawerType = action.payload.drawerType;
      state.drawerData = action.payload.drawerData;
    },
  }
});

export const { toggleDrawer } = appSlice.actions;

export const appReducer = appSlice.reducer;
