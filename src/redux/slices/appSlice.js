import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  drawerType: null,
  drawerData: null,
  draweDraggable: false,
  drawerHeight: null,
  notificationActive: false,
  notificationMessage: null,
  notificationIntent: null,
  notificationDuration: null
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
      state.drawerHeight = action.payload.drawerHeight;
    },
    toggleNotification: (state, action) => {
      state.notificationActive = action.payload.notificationActive;
      state.notificationMessage = action.payload.notificationMessage;
      state.notificationIntent = action.payload.notificationIntent;
      state.notificationDuration = action.payload.notificationDuration;
    },
  }
});

export const { toggleDrawer, toggleNotification } = appSlice.actions;

export const appReducer = appSlice.reducer;
