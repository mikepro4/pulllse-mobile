import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Audio } from "expo-av";

const loadAudio = createAsyncThunk(
  "player/loadAudio",
  async ({ uri, link, type, track }, { dispatch }) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    const status = await sound.getStatusAsync();
    return { sound, status, link, type, track };
  }
);

const togglePlayback = createAsyncThunk(
  "player/togglePlayback",
  async ({ sound, isPlaying, playbackPosition }, { dispatch }) => {
    console.log(playbackPosition);
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.setPositionAsync(playbackPosition);
      await sound.playAsync();
    }
    return { isPlaying: !isPlaying }; // Toggle the isPlaying state
  }
);

const onSliderValueChange = createAsyncThunk(
  "player/toggleSlider",
  async ({ sound, position }, { dispatch }) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
    return position;
  }
);

export { loadAudio, togglePlayback, onSliderValueChange };
