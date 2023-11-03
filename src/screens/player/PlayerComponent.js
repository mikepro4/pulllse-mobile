import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import RNSoundLevel from "react-native-sound-level";
import { uploadAudio, createPulse } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../../components/text";
import Icon from "../../components/icon";
import { useFocusEffect } from "@react-navigation/native";
import { modifyObjectArray } from "../../components/soundbar/soundbarThunk";

import * as Clipboard from "expo-clipboard";

import SoundBar from "../../components/soundbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../../config";

import Button from "../../components/button";
import SpotifyPlayer from "../../components/spotify_player";

export default function App() {
  const [name, setName] = useState("Recording");
  const [recording, setRecording] = useState();
  const [blob, setBlob] = useState();
  const [sound, setSound] = useState();

  const [duration, setDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [soundLevels, setSoundLevels] = useState([]);

  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [currentView, setCurrentView] = useState("waveform");
  const [spotifyTrack, setSpotifyTrack] = useState();

  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  const toggleView = () => {
    switch (currentView) {
      case "file":
        setCurrentView("waveform");
        break;
      case "waveform":
        setCurrentView("spotify");
        break;
      case "spotify":
        setCurrentView("file");
        break;
      default:
        setCurrentView("file");
    }
  };
  const toggleButton = () => {
    switch (currentView) {
      case "file":
        return (
          <TouchableOpacity onPress={toggleView} onLongPress={startRecording}>
            <View style={styles.btnContainer}>
              <Icon name="fileIcon" />
            </View>
          </TouchableOpacity>
        );
      case "waveform":
        return !isRecording ? (
          <TouchableOpacity onPress={toggleView} onLongPress={startRecording}>
            <View style={styles.btnContainer}>
              <View style={styles.startRec} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={stopRecording}>
            <View style={styles.stopRec}>
              <Icon name="stopRec" />
            </View>
          </TouchableOpacity>
        );
      case "spotify":
        return (
          <TouchableOpacity
            onPress={!spotifyTrack ? toggleView : null}
            onLongPress={() => getTrack("1sseW3KwsD0HSBnjqJTS1D")}
          >
            <Icon name="spotifyIcon" style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
        );
    }
  };

  const loadAudio = async (audioLink) => {
    const soundInstance = new Audio.Sound();

    try {
      await soundInstance.loadAsync({ uri: audioLink });
      setSound(soundInstance);
    } catch (error) {
      console.error("Error loading audio", error);
    }
  };

  const getTrack = async () => {
    try {
      const link = await Clipboard.getStringAsync();

      const token = await AsyncStorage.getItem("accessToken");
      function getSpotifyTrackID() {
        const match = link.match(/track\/([a-zA-Z0-9]+)\?/);
        return match ? match[1] : null;
      }

      const id = getSpotifyTrackID();

      const response = await axios.get(config.spotifyURL + id + "?market=us", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpotifyTrack(response.data);
      loadAudio(response.data.preview_url);
      setDuration(30000);
    } catch (error) {
      console.error("Error fetching track:", error);
    }
  };

  useEffect(() => {
    if (sound) {
      // Updating the playback position regularly
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          // Check if playback just finished and user had pressed play
          setPlaybackPosition(0); // Reset the slider to the initial position
          await sound.setPositionAsync(0);
          if (isLooping) {
            setIsPlaying(true);
          }
          if (!isLooping) {
            setIsPlaying(false);
          }
        } else {
          setPlaybackPosition(status.positionMillis); // Otherwise, continue updating the slider position
        }
      });
    }
  }, [sound, isLooping]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // This function will be executed when the screen loses focus
        if (isRecording) {
          stopRecording();
        }
      };
    }, [isRecording]) // Dependencies for useCallback
  );

  useEffect(() => {
    RNSoundLevel.onNewFrame = (data) => {
      // Output the sound level data

      if (data.id % 2 === 0) {
        setSoundLevels((prevLevels) => [...prevLevels, data]);
      }
    };

    return async () => {
      // Ensure to stop the monitor
      RNSoundLevel.stop();
    };
  }, []);

  const reset = async () => {
    try {
      // If there's a recording in progress, stop it
      if (isRecording && recording) {
        await recording.stopAndUnloadAsync();
      }

      // If something is playing, stop it
      if (sound) {
        await sound.stopAsync();
        if (sound._loaded) {
          // Check if sound is loaded before trying to unload
          await sound.unloadAsync();
        }
      }

      // Reset state
      setRecording(undefined);
      setSound(undefined);
      setIsRecording(false);
      setIsPlaying(false);
      setPlaybackPosition(0);
      setDuration(0);
      setBlob(undefined);
      setSoundLevels([]);
      setName("Recording");
      setIsLooping(false);
    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  const clearSpotifyTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      if (sound._loaded) {
        // Check if sound is loaded before trying to unload
        await sound.unloadAsync();
      }
    }
    setSpotifyTrack(null);
    setSound(undefined);
    setIsRecording(false);
    setIsPlaying(false);
    setPlaybackPosition(0);
    setDuration(0);
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
        setPlaybackPosition(value);
      } catch (error) {
        console.error("Error seeking:", error);
      }
    }
  };

  const toggleLooping = async () => {
    try {
      await sound.setIsLoopingAsync(!isLooping); // Toggle the looping status
      setIsLooping(!isLooping);
    } catch (error) {
      console.error(error);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        RNSoundLevel.start();
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await newRecording.startAsync();

        setRecording(newRecording);
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    RNSoundLevel.stop();
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // URI of the recorded file
      const { status } = await recording.createNewLoadedSoundAsync();

      // To play the recording
      const { sound } = await Audio.Sound.createAsync({ uri }, { volume: 1.0 });
      // const formData = new FormData();

      const response = await fetch(uri);
      setBlob(await response.arrayBuffer());
      setDuration(status.durationMillis);

      setSound(sound);
      const modifiedObjects = modifyObjectArray(soundLevels);
      setSoundLevels(modifiedObjects);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setIsRecording(false); // Set recording status to false
    } catch (error) {
      console.log(error);
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

  const pulse = async (data) => {
    dispatch(
      createPulse({ name, userId: storedUserInfo._id, audioId: data._id })
    );
  };

  const rederPlayerButtons = () => {
    if (currentView === "waveform" && sound) {
      return (
        <View style={styles.btnContainer}>
          <Button
            icon={isPlaying ? "pause" : "play"}
            iconColor="black"
            onPressIn={togglePlayback}
          />
        </View>
      );
    } else {
      return toggleButton();
    }
  };

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = (minutes - minutesDisplay) * 60;
    const secondsDisplay =
      seconds < 10 ? `0${Math.round(seconds)}` : Math.round(seconds);
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  const renderSlider = () => {
    switch (currentView) {
      case "waveform":
        return (
          <>
            <View style={styles.sliderContainer}>
              <>
                {sound && (
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    placeholder="Recording"
                  />
                )}
                <SoundBar
                  duration={duration}
                  playbackPosition={playbackPosition}
                  barData={soundLevels}
                  onSeek={async (position) => {
                    await sound.setPositionAsync(position); // Assuming 'sound' is your sound object
                    setPlaybackPosition(position);
                  }}
                  isRecording={isRecording}
                />

                {sound && (
                  <View style={styles.duration}>
                    <CustomText style={{ fontSize: 14 }}>
                      {getDurationFormatted(playbackPosition)}
                    </CustomText>
                    <CustomText style={{ fontSize: 14 }}>
                      {getDurationFormatted(duration)}
                    </CustomText>
                  </View>
                )}
              </>
            </View>
            {sound && (
              <>
                <View style={styles.trashLoop}>
                  <TouchableOpacity onPress={reset}>
                    <View style={styles.trashIcon}>
                      <Icon
                        name="trashIcon"
                        style={{
                          color: "#F25219",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleLooping}>
                    <View style={styles.trashIcon}>
                      <Icon
                        name="loopIcon"
                        style={{
                          color: isLooping ? "#6D55FF" : "#fff",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        );

      case "spotify":
        return (
          <SpotifyPlayer
            spotifyTrack={spotifyTrack}
            playbackPosition={playbackPosition}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            clearSpotifyTrack={clearSpotifyTrack}
            duration={duration}
            onSliderValueChange={onSliderValueChange}
          />
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,

        position: "relative",
        zIndex: 1,
      }}
    >
      <View style={styles.buttonSlider}>
        {rederPlayerButtons()}
        {renderSlider()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  smallPlayPause: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: -5,
    left: -10,
  },
  durationSpotify: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    alignItems: "center",
    bottom: -35,
    width: 265,
    zIndex: 1,
  },
  spotifyImage: {
    position: "absolute",
    right: -30,
    top: -5,
  },
  trashIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  spotifySongHeader: { fontSize: 16, color: "#fff", marginBottom: 2 },
  spotifySongArtist: { fontSize: 14, color: "#777" },

  sliderContainer: {
    width: 300,
  },
  spotifyLinkContainer: {
    left: 3,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
    bottom: 35,
    width: 275,
    justifyContent: "space-between",
  },

  trashLoop: {
    gap: 5,
  },
  buttonSlider: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "start",
    marginLeft: 15,
    height: 100,
  },

  duration: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: -20,
    width: 300,
  },
  startRec: {
    width: 20,
    height: 20,
    backgroundColor: "#F25219",
    borderRadius: 100,
  },
  stopRec: {
    width: 50,
    height: 50,
    backgroundColor: "#F25219",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },

  goContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#29FF7F",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginTop: 100,
  },
  btnContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },

  input: {
    height: 30,
    color: "#fff",
    position: "absolute",
    fontSize: 18,
    zIndex: 1000,
    bottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

// const makePulse = () => {
//   dispatch(
//     uploadAudio({
//       blob,
//       duration,
//       callback: async (data) => {
//         pulse(data);
//       },
//     })
//   );
//   setName("Recording");
// };
