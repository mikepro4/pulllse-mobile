import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  originalViz: null,
  viz: null,
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {

    // unused
    setParams: (state, action) => {
      state.params = action.payload;
    },

    setShader: (state, action) => {
      state.shader = action.payload;
    },

    // end unused

    setViz: (state, action) => {
      state.viz = action.payload;
    },

    setSource: (state, action) => {
      if(action.payload?.source) {
        if(action.payload?.destination == "main") {
          state.viz.main.source = action.payload.source;
        }

        if(action.payload?.destination == "buffer") {
          state.viz.buffer.source = action.payload.source;
        }
      }
    },

    setUniforms: (state, action) => {
      if(action.payload?.uniforms) {
        if(action.payload?.destination == "main") {
          state.viz.main.uniforms = action.payload.uniforms;
        }

        if(action.payload?.destination == "buffer") {
          state.viz.buffer.uniforms = action.payload.uniforms;
        }
      }
    },
  }
});

export const { 
  setParams,
  setShader,
  setSource,
  setUniforms,
  setViz
} = shapeSlice.actions;

export const shapeReducer = shapeSlice.reducer;
