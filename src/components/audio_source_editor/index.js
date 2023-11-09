import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import RecordingEditor from "./recordingEditor";
import SpotifyEditor from "./spotifyEditor";
import FileEditor from "./fileEditor";
import { useFocusEffect } from "@react-navigation/native";
import { setPlaybackPosition, setIsPlaying } from "../../redux";

const App = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const sound = useSelector((state) => state.pulseRecording.sound);

  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          dispatch(setPlaybackPosition(0));
          await sound.setPositionAsync(0);

          dispatch(setIsPlaying(false));
        } else {
          dispatch(setPlaybackPosition(status.positionMillis));
        }
      });
    }
  }, [sound]);

  const toggleLooping = async () => {
    try {
      await sound.setIsLoopingAsync(!isLooping);
      setIsLooping(!isLooping);
    } catch (error) {
      console.error(error);
    }
  };

  const renderEditor = () => {
    switch (player.editedPulse?.audioSourceType) {
      case "recording":
        return <RecordingEditor />;
      case "file":
        return <FileEditor />;
      case "spotify":
        return <SpotifyEditor />;
      default:
        return;
    }
  };

  return <View>{renderEditor()}</View>;
};

export default App;
