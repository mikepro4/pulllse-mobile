import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import CustomText from "../text";
import Button from "../../components/button";

import RNSoundLevel from "react-native-sound-level";
import { Audio } from "expo-av";
import SoundBar from "../soundbar";
import { modifyObjectArray } from "../soundbar/soundbarThunk";
import Icon from "../../components/icon";
import { getDurationFormatted } from "../../utils/getDurationFormated";
import {
  addSoundLevel,
  setSoundLevels,
  loadAudio,
  resetPulseRecording,
  onSliderValueChange,
  togglePlayback,
} from "../../redux";

const RecordingEditor = () => {
  const dispatch = useDispatch();
  const sound = useSelector((state) => state.pulseRecording.sound);
  const duration = useSelector((state) => state.pulseRecording.duration);
  const isPlaying = useSelector((state) => state.pulseRecording.isPlaying);
  const soundLevels = useSelector((state) => state.pulseRecording.soundLevels);
  const type = useSelector((state) => state.pulseRecording.type);
  const playbackPosition = useSelector(
    (state) => state.pulseRecording.playbackPosition
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [waveWidth, setWaveWidth] = useState(100);

  const onEditorRightLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWaveWidth(width);
  };

  useEffect(() => {
    RNSoundLevel.onNewFrame = (data) => {
      dispatch(addSoundLevel(data));
    };

    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (sound) {
      dispatch(resetPulseRecording());
    }
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
      const uri = recording.getURI();

      const response = await fetch(uri);
      const blob = await response.arrayBuffer();

      const modifiedObjects = modifyObjectArray(soundLevels, waveWidth);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      dispatch(setSoundLevels(modifiedObjects));
      dispatch(
        loadAudio({
          uri: uri,
          link: uri,
          type: "recording",
          track: { blob },
        })
      );

      setIsRecording(false);
    } catch (error) {
      console.log(error);
    }
  };

  const rederPlayerButtons = () => {
    if (sound && type === "recording") {
      return (
        <View style={styles.btnContainer}>
          <Button
            icon={isPlaying ? "pause" : "play"}
            iconColor="black"
            onPressIn={() =>
              dispatch(togglePlayback({ sound, isPlaying, playbackPosition }))
            }
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
      <View style={styles.editorRight} onLayout={onEditorRightLayout}>
        {(sound && type === "recording") || isRecording ? (
          <SoundBar
            duration={duration}
            playbackPosition={playbackPosition}
            barData={soundLevels}
            onSeek={(position) => {
              dispatch(onSliderValueChange({ sound, position }));
            }}
            isRecording={isRecording}
            canvasWidth={waveWidth}
          />
        ) : (
          <View style={[styles.emptyRecordingContainer, { width: waveWidth }]}>
            <CustomText style={styles.emptyAudioText}>
              Record audio...
            </CustomText>
          </View>
        )}
        {sound && type === "recording" && (
          <View style={[styles.duration, { width: waveWidth }]}>
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
      {sound && type === "recording" ? (
        <TouchableOpacity onPress={() => dispatch(resetPulseRecording())}>
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
    marginRight: 10,
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
