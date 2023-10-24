import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Creating a pulse
const createPulse = createAsyncThunk(
  "pulse/create",
  async ({ name, userId, audioId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/pulse/createPulse", {
        name,
        userId,
        audioId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetching all pulses
const fetchPulses = createAsyncThunk(
  "pulse/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/pulse/fetchPulse");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deleting a pulse
const deletePulse = createAsyncThunk(
  "pulse/delete",
  async ({ pulseId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/pulse/deletePulse", {
        pulseId,
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export { createPulse, deletePulse, fetchPulses };
