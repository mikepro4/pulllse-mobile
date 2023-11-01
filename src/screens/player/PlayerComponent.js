import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import RNSoundLevel from "react-native-sound-level";
import { uploadAudio, createPulse } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../../components/text";
import Icon from "../../components/icon";
import { useFocusEffect } from "@react-navigation/native";
import { modifyObjectArray } from "../../components/soundbar/soundbarThunk";

import Slider from "@react-native-community/slider";
import SoundBar from "../../components/soundbar";
import SignInWithService from "../settings/SignInWithService";

export default function App() {
  const [name, setName] = useState("Recording");
  const [recording, setRecording] = useState();
  const [blob, setBlob] = useState();
  const [sound, setSound] = useState();

  const [duration, setDuration] = useState(0);
  console.log("duration", duration);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  console.log("playbackPosition", playbackPosition);
  const [soundLevels, setSoundLevels] = useState([]);

  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const dispatch = useDispatch();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

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

  const onSliderValueChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPlaybackPosition(value);
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

  const makePulse = () => {
    dispatch(
      uploadAudio({
        blob,
        duration,
        callback: async (data) => {
          console.log("here", data._id);
          pulse(data);
        },
      })
    );
    setName("Recording");
  };

  const rederPlayerButtons = () => {
    if (sound) {
      return (
        <TouchableOpacity onPress={togglePlayback}>
          <View style={styles.btnContainer}>
            <Icon name={isPlaying ? "pause" : "play"} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return !isRecording ? (
        <TouchableOpacity onPress={startRecording}>
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
        <View style={styles.sliderContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(value) => setName(value)}
            placeholder="Recording"
          />
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
      </View>
      {/* <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={0}
        maximumValue={duration || 1}
        value={playbackPosition}
        onSlidingComplete={onSliderValueChange}
        minimumTrackTintColor="#ccc"
        maximumTrackTintColor="#444"
      /> */}
      <SignInWithService />
      <TouchableOpacity onPress={makePulse}>
        <View style={styles.goContainer}>
          <CustomText style={{ fontWeight: "bold", fontSize: 24 }}>
            Go
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  sliderContainer: {
    width: 300,
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
    backgroundColor: "#000",
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
  trashIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
