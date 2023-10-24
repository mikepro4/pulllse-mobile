import { createSlice } from "@reduxjs/toolkit";
import { createPulse, deletePulse, fetchPulses } from "../thunks/pulseThunk"; // Adjust the import path

const initialState = {
  pulses: [],
  pulse: {
    name: "",
    audio: null,
  },
  status: "idle",
  error: null,
};

const pulseSlice = createSlice({
  name: "pulse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPulse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPulse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pulses.push(action.payload);
      })
      .addCase(createPulse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPulses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPulses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pulses = action.payload;
      })
      .addCase(fetchPulses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePulse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePulse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pulses = state.pulses.filter(
          (pulse) => pulse.id !== action.payload.id
        );
      })
      .addCase(deletePulse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const pulseReducer = pulseSlice.reducer;
