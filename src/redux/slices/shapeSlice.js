import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  params: null
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setParams: (state, action) => {
      state.params = action.payload;
    },
  }
});

export const { 
  setParams
} = shapeSlice.actions;

export const shapeReducer = shapeSlice.reducer;
