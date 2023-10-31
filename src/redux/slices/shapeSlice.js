import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  params: null,
  shader: null
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    setParams: (state, action) => {
      state.params = action.payload;
    },

    setShader: (state, action) => {
      state.shader = action.payload;
    },
  }
});

export const { 
  setParams,
  setShader
} = shapeSlice.actions;

export const shapeReducer = shapeSlice.reducer;
