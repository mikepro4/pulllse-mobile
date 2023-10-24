import { createSlice } from "@reduxjs/toolkit";
import { fetchFeed } from "../thunks/feedThunk";

const initialState = {
  feed: [],

  status: "idle",
  error: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feed = action.payload;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const feedReducer = feedSlice.reducer;
