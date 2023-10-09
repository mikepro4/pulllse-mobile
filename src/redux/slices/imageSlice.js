import { createSlice } from "@reduxjs/toolkit";
import { uploadImage, fetchUserImage, deleteImage } from "../thunks/imageThunk";

const initialState = {
  image: "",
  status: "idle", // to track the request status
  error: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.image.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.image = action.payload; // Set the image link
        state.status = "succeeded";
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.image = action.payload;
      })
      .addCase(fetchUserImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (state.image === action.payload) {
          state.image = ""; // Clear the image or set to any default value
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addImage } = imageSlice.actions;

export const imageReducer = imageSlice.reducer;
