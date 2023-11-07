import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPulseRecording } from "../../redux";

import CustomText from "../text";
import Button from "../../components/button";
import { useFocusEffect } from "@react-navigation/native";

import RNSoundLevel from "react-native-sound-level";
import { Audio } from "expo-av";
import SoundBar from "../soundbar";
import { modifyObjectArray } from "../soundbar/soundbarThunk";
import Icon from "../../components/icon";
import { getDurationFormatted } from "../../utils/getDurationFormated";

const RecordingEditor = ({
  sound,
  setSound,
  isLooping,
  setIsLooping,
  isPlaying,
  setIsPlaying,
  duration,
  setDuration,
  playbackPosition,
  setPlaybackPosition,
  onSliderValueChange,
  togglePlayback,
}) => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();

  const [soundLevels, setSoundLevels] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  console.log(soundLevels);
  const [recording, setRecording] = useState();
  const [blob, setBlob] = useState();
  useFocusEffect(
    React.useCallback(() => {
      // No operation when the screen is focused

      return () => {
        // This will run when the screen loses focus
        if (isRecording) {
          stopRecording();
        }
      };
    }, [isRecording, stopRecording])
  );

  useEffect(() => {
    RNSoundLevel.onNewFrame = (data) => {
      // Output the sound level data

      if (data.id) {
        setSoundLevels((prevLevels) => [...prevLevels, data]);
      }
    };
    return async () => {
      if (sound) {
        await sound.unloadAsync();
        dispatch(
          addPulseRecording({
            duration,
            type: "recording",
            soundLevels,
            link: recording ? recording.getURI() : "",
          })
        );
      }
    };
  }, [sound]);

  useEffect(() => {
    return () => reset();
  }, []);

  const reset = async () => {
    try {
      // If there's a recording in progress, stop it
      if (isRecording) {
        await recording.stopAndUnloadAsync();
      }

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

      setIsLooping(false);
    } catch (error) {
      console.log("Error resetting:", error);
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
      console.log(uri);
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

  const rederPlayerButtons = () => {
    if (sound) {
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
      return !isRecording ? (
        <TouchableOpacity onPress={startRecording}>
          <View style={styles.recordButtonContainer}>
            <View style={styles.recordButton}></View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={stopRecording}>
          <View
            style={[styles.recordButtonContainer, { borderColor: "#F25219" }]}
          >
            <View
              style={[styles.recordButton, { backgroundColor: "#F25219" }]}
            ></View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.editorContainer}>
      <View style={styles.editorLeft}>{rederPlayerButtons()}</View>
      <View style={styles.editorRight}>
        {/* <View style={styles.emptyRecordingContainer}>
          <CustomText style={styles.emptyAudioText}>Record audio...</CustomText>
        </View> */}

        {recording || isRecording ? (
          <SoundBar
            duration={duration}
            playbackPosition={playbackPosition}
            barData={soundLevels}
            onSeek={(position) => {
              onSliderValueChange(position);
            }}
            isRecording={isRecording}
          />
        ) : (
          <View style={styles.emptyRecordingContainer}>
            <CustomText style={styles.emptyAudioText}>
              Record audio...
            </CustomText>
          </View>
        )}
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
      {/* <CustomText>Recording Editor</CustomText> */}
      {sound ? (
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
      ) : (
        <View style={styles.trashIcon}></View>
      )}
    </View>
  );
};

export default RecordingEditor;

const styles = StyleSheet.create({
  trashIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  duration: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: -20,
    width: 250,
  },
  editorLeft: {
    width: 50,
    height: 70,
    // backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  editorRight: {
    flex: 1,
    // backgroundColor: "red",
    height: 70,
    position: "relative",
    justifyContent: "center",
  },
  recordButtonContainerRed: {
    backgroundColor: "red",
  },
  recordButtonContainer: {
    width: 50,
    height: 50,
    // backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  recordButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 50,
    // borderWidth: 1,
    // borderColor: "white",
  },
  editorContainer: {
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
    height: 142,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
  },
  emptyRecordingContainer: {
    width: 250,
    // flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  emptyAudioText: {
    color: "white",
    fontSize: 14,
    opacity: 0.3,
    position: "relative",
    top: -2,
  },
});
