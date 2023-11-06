import React, { useState, useEffect, useCallback } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CustomText from "../text";
import RecordingEditor from "./recordingEditor";
import SpotifyEditor from "./spotifyEditor";
import FileEditor from "./fileEditor";
import { useFocusEffect } from "@react-navigation/native";

const App = () => {
  const player = useSelector((state) => state.player);
  const state = useSelector((state) => state.audio.audios);
  console.log("state", state);
  const [sound, setSound] = useState();

  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  useEffect(() => {
    if (sound) {
      // Updating the playback position regularly
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          // Check if playback just finished and user had pressed play
          setPlaybackPosition(0); // Reset the slider to the initial position
          await sound.setPositionAsync(0);

          setIsPlaying(false);
        } else {
          setPlaybackPosition(status.positionMillis); // Otherwise, continue updating the slider position
        }
      });
    }
  }, [sound]);

  const toggleLooping = async () => {
    try {
      await sound.setIsLoopingAsync(!isLooping); // Toggle the looping status
      setIsLooping(!isLooping);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.setPositionAsync(playbackPosition);
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying); // Toggle the isPlaying state
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
        setPlaybackPosition(value);
      } catch (error) {
        console.log("sound", sound);
        console.error("Error seeking:", error);
      }
    }
  };

  const renderEditor = () => {
    switch (player.editedPulse?.audioSourceType) {
      case "recording":
        return (
          <RecordingEditor
            sound={sound}
            setSound={setSound}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            duration={duration}
            setDuration={setDuration}
            playbackPosition={playbackPosition}
            setPlaybackPosition={setPlaybackPosition}
            togglePlayback={togglePlayback}
            onSliderValueChange={onSliderValueChange}
          />
        );
      case "file":
        return (
          <FileEditor
            sound={sound}
            setSound={setSound}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            duration={duration}
            setDuration={setDuration}
            playbackPosition={playbackPosition}
            setPlaybackPosition={setPlaybackPosition}
            togglePlayback={togglePlayback}
            onSliderValueChange={onSliderValueChange}
          />
        );
      case "spotify":
        return (
          <SpotifyEditor
            sound={sound}
            setSound={setSound}
            isLooping={isLooping}
            setIsLooping={setIsLooping}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            duration={duration}
            setDuration={setDuration}
            playbackPosition={playbackPosition}
            setPlaybackPosition={setPlaybackPosition}
            togglePlayback={togglePlayback}
            onSliderValueChange={onSliderValueChange}
          />
        );
      default:
        return;
    }
  };

  return <View>{renderEditor()}</View>;
};

export default App;
