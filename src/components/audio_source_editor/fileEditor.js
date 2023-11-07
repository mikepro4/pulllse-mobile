import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import Button from "../../components/button";
import LineSoundBar from "../soundbar/lineSoundbar";
import SoundBar from "../soundbar";
import RNSoundLevel from "react-native-sound-level";
import { modifyObjectArray } from "../soundbar/soundbarThunk";
import { addPulseRecording } from "../../redux";

import CustomText from "../text";
import Icon from "../icon";
import { center } from "@shopify/react-native-skia";

const RecordingEditor = ({
  sound,
  setSound,
  isPlaying,
  setIsPlaying,
  duration,
  setDuration,
  playbackPosition,
  setPlaybackPosition,
  togglePlayback,
  onSliderValueChange,
}) => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);

  const [recording, setRecording] = useState();
  const [blob, setBlob] = useState();

  const [soundLevels, setSoundLevels] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const fileInfo = extractFileInfo();

  useEffect(() => {
    if (duration === playbackPosition) {
      stopRecordWaveForm();
    }
  }, [duration, playbackPosition]);

  function extractFileInfo() {
    if (recording) {
      const fileObject = recording.assets[0];
      const { name, size, uri } = fileObject;
      const nameParts = name.split(".");

      if (nameParts.length > 1) {
        const extension = nameParts.pop();
        const fileNameWithoutExtension = nameParts.join(".");
        const sizeInMB = (size / (1024 * 1024)).toFixed(2) + " MB";

        return {
          fileName: fileNameWithoutExtension,
          extension: extension,
          formattedSize: sizeInMB,
          uri,
        };
      } else {
        const sizeInMB = (size / (1024 * 1024)).toFixed(2) + " MB";
        return {
          fileName: name,
          extension: "",
          formattedSize: sizeInMB,
          uri,
        };
      }
    }
  }

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
            type: "file",
            soundLevels: soundLevels,
            link: fileInfo.uri,
            fileName: fileInfo?.fileName,
            extension: fileInfo?.extension,
          })
        );
      }
    };
  }, [sound]);
  useEffect(() => {
    return () => clearFile();
  }, []);
  const clearFile = async () => {
    try {
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
      setSoundLevels([]);
      setIsPlaying(false);
      setPlaybackPosition(0);
      setDuration(0);
      setBlob(undefined);
      RNSoundLevel.stop();
      setIsLooping(false);
    } catch (error) {
      console.log("Error resetting:", error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  console.log("response", blob);
  const loadSound = async (uri) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis);
      }
      const response = await fetch(uri);

      setBlob(response.arrayBuffer());

      setSound(newSound);
    } catch (e) {
      console.error(`Error loading sound: ${e}`);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
      if (result.canceled) {
        return;
      }
      const uri = result.assets[0].uri;

      setRecording(result);
      await loadSound(uri);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecordWaveForm = () => {
    RNSoundLevel.stop();

    setIsRecording(false);
    setSoundLevels(modifyObjectArray(soundLevels));
  };

  const recordWaveForm = async () => {
    // Reset the slider to the initial position
    setSoundLevels([]);

    await sound.setPositionAsync(0);
    await sound.playAsync();
    RNSoundLevel.start();
    setPlaybackPosition(0);
    setIsRecording(true);
  };
  const cancelWaveformRecord = () => {
    RNSoundLevel.stop();
    setIsPlaying(true);
    setIsRecording(false);
    setSoundLevels([]);
  };

  const trashIcon = (
    <TouchableOpacity onPress={clearFile}>
      <View style={styles.trashIcon}>
        <Icon
          name="trashIcon"
          style={{
            color: "#F25219",
          }}
        />
      </View>
    </TouchableOpacity>
  );
  const waveFormIcon = (
    <TouchableOpacity
      onPress={() => {
        recordWaveForm();
      }}
      disabled={soundLevels.length !== 0}
    >
      <Icon
        name="waveForm"
        style={{
          width: 30,
          height: 30,
          color: isRecording ? "#F25219" : "#29FF7F",
        }}
      />
    </TouchableOpacity>
  );

  const recordButton = (
    <TouchableOpacity onPress={cancelWaveformRecord}>
      <View style={[styles.recordButtonContainer, { borderColor: "#F25219" }]}>
        <View
          style={[styles.recordButton, { backgroundColor: "#F25219" }]}
        ></View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.editorContainer}>
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={pickDocument}
            style={[styles.urlContainer, isFocused && styles.activeBorder]}
          >
            <CustomText style={styles.trackUrl}>AUDIO FILE:</CustomText>

            <TextInput
              style={styles.trackUrlInput}
              placeholder={!recording ? "Select file...." : fileInfo?.uri}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {recording && trashIcon}
        </View>

        <View style={styles.trackPreviewContainer}>
          {!recording ? (
            <View style={styles.trackPreviewLeft}>
              <Icon style={{ opacity: 0.5 }} name="x" />
            </View>
          ) : (
            <View style={styles.toggleContainer}>
              {isRecording ? (
                recordButton
              ) : (
                <View style={styles.btnContainer}>
                  <Button
                    icon={isPlaying ? "pause" : "play"}
                    iconColor="black"
                    onPressIn={togglePlayback}
                  />
                </View>
              )}
            </View>
          )}

          {recording ? (
            <View style={styles.trackPreviewRight}>
              {soundLevels.length !== 0 ? (
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
                <>
                  <CustomText style={styles.spotifySongHeader}>
                    {fileInfo?.fileName}
                  </CustomText>
                  <CustomText style={styles.spotifySongArtist}>
                    {fileInfo?.extension}
                  </CustomText>
                </>
              )}

              <View style={styles.waveFormIcon}>{waveFormIcon}</View>
            </View>
          ) : (
            <View style={styles.trackPreviewRight}>
              <View style={styles.trackTitle}></View>
              <View style={styles.artistName}></View>
            </View>
          )}
        </View>
        {recording && !isRecording && soundLevels.length === 0 && (
          <View style={{ top: 32 }}>
            <LineSoundBar
              duration={duration}
              playbackPosition={playbackPosition}
              onSeek={(position) => {
                onSliderValueChange(position);
              }}
            />
          </View>
        )}
        {/* <CustomText>Recording Editor</CustomText> */}
      </View>
    </>
  );
};

export default RecordingEditor;

const styles = StyleSheet.create({
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
  waveFormIcon: { position: "absolute", right: 10 },

  trashIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "rgba(41, 255, 127, 0.05)",
    borderColor: "rgba(41, 255, 127, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: 1,
  },
  spotifySongHeader: { fontSize: 18, color: "#fff", marginBottom: 2 },
  spotifySongArtist: { fontSize: 14, color: "#777" },
  btnContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  trackPreviewContainer: {
    height: 40,
    flexDirection: "row",
  },
  trackTitle: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 150,
    height: 20,
    borderRadius: 3,
    marginBottom: 10,
  },
  artistName: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 100,
    height: 10,
    borderRadius: 3,
  },
  trackPreviewLeft: {
    width: 60,
    height: 60,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  toggleContainer: {
    width: 60,
    height: 60,
    marginRight: 10,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  trackPreviewRight: {
    flex: 1,
    height: 60,
    // backgroundColor: "red"
    justifyContent: "center",
  },
  trackUrlInput: {
    position: "relative",
    top: 0,
    left: 72,
    right: 0,
    bottom: 0,
    color: "white",
    fontFamily: "aeonik-regular",
    paddingRight: 70,

    // backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  trackUrl: {
    fontFamily: "london",
    fontSize: 7,
    color: Theme.green,
    position: "absolute",
    top: 15,
    left: 13,
    textShadowColor: "#0F0",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  urlContainer: {
    backgroundColor: "rgba(41, 255, 127, 0.05)",

    height: 40,

    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(41, 255, 127, 0.2)",
    position: "relative",
    marginBottom: 20,
    flexDirection: "row",
    flex: 1,
  },
  activeBorder: {
    borderColor: "rgba(41, 255, 127, 1.0)",
  },
  editorContainer: {
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
    // alignItems: "center",
    position: "relative",
    // flexDirection: "row",
    height: 142,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
  },
});
