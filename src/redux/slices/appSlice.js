import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  drawerType: null,
  drawerData: null,
  draweDraggable: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDrawer: (state, action) => {
      state.drawerOpen = action.payload.drawerOpen;
      state.drawerType = action.payload.drawerType;
      state.drawerData = action.payload.drawerData;
      state.drawerDraggable = action.payload.drawerDraggable;
    },
  }
});

export const { toggleDrawer } = appSlice.actions;

export const appReducer = appSlice.reducer;
