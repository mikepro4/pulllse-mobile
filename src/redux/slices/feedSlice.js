import { createSlice } from "@reduxjs/toolkit";
import { fetchFeed } from "../thunks/feedThunk";

const initialState = {
  time: "1",
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    updateTimeStamp: (state, action) => {
      state.time = action.payload;
    },
  }
});

export const { updateTimeStamp } = feedSlice.actions;

export const feedReducer = feedSlice.reducer;
