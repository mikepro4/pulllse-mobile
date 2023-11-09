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
import Button from "../../components/button";
import LineSoundBar from "../soundbar/lineSoundbar";
import SoundBar from "../soundbar";
import RNSoundLevel from "react-native-sound-level";
import { modifyObjectArray } from "../soundbar/soundbarThunk";

import CustomText from "../text";
import Icon from "../icon";
import { center } from "@shopify/react-native-skia";
import {
  addSoundLevel,
  setSoundLevels,
  loadAudio,
  setIsPlaying,
  resetPulseRecording,
  onSliderValueChange,
  togglePlayback,
  setPlaybackPosition,
  setExtencionFilename,
} from "../../redux";

const RecordingEditor = () => {
  const dispatch = useDispatch();

  const sound = useSelector((state) => state.pulseRecording.sound);
  const duration = useSelector((state) => state.pulseRecording.duration);
  const isPlaying = useSelector((state) => state.pulseRecording.isPlaying);
  const soundLevels = useSelector((state) => state.pulseRecording.soundLevels);
  const extension = useSelector((state) => state.pulseRecording.extension);
  const fileName = useSelector((state) => state.pulseRecording.fileName);
  const uri = useSelector((state) => state.pulseRecording.link);
  const type = useSelector((state) => state.pulseRecording.type);
  const playbackPosition = useSelector(
    (state) => state.pulseRecording.playbackPosition
  );

  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [waveWidth, setWaveWidth] = useState(100);

  const onEditorRightLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWaveWidth(width);
  };

  useEffect(() => {
    RNSoundLevel.onNewFrame = (data) => {
      dispatch(addSoundLevel(data));
    };
  }, []);

  useEffect(() => {
    if (duration === playbackPosition) {
      stopRecordWaveForm();
    }
  }, [duration, playbackPosition]);

  const extractFileInfo = (result) => {
    if (result) {
      const fileObject = result.assets[0];
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
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const pickDocument = async () => {
    if (sound) {
      dispatch(resetPulseRecording());
    }
    try {
      let result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
      if (result.canceled) {
        return;
      }
      const uri = result.assets[0].uri;

      //  setRecording(result);
      const response = await fetch(uri);
      //  setRecording(result);
      const blob = response.arrayBuffer();
      const Info = extractFileInfo(result);
      dispatch(
        setExtencionFilename({
          fileName: Info?.fileName,
          extension: Info?.extension,
        })
      );
      dispatch(
        loadAudio({
          uri: uri,
          link: uri,
          type: "file",
          track: { blob },
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecordWaveForm = () => {
    RNSoundLevel.stop();

    setIsRecording(false);
    setSoundLevels(modifyObjectArray(soundLevels, waveWidth - 120));
  };

  const recordWaveForm = async () => {
    // Reset the slider to the initial position
    dispatch(setSoundLevels([]));

    await sound.setPositionAsync(0);
    await sound.playAsync();
    RNSoundLevel.start();
    dispatch(setPlaybackPosition(0));
    setIsRecording(true);
  };
  const cancelWaveformRecord = () => {
    RNSoundLevel.stop();
    dispatch(setIsPlaying(true));
    setIsRecording(false);
    dispatch(setSoundLevels([]));
  };

  const trashIcon = (
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
      <View style={styles.editorContainer} onLayout={onEditorRightLayout}>
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
              placeholder={!uri ? "Select file...." : uri}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {uri && type === "file" && trashIcon}
        </View>

        <View style={styles.trackPreviewContainer}>
          {uri && type === "file" ? (
            <View style={styles.toggleContainer}>
              {isRecording ? (
                recordButton
              ) : (
                <View style={styles.btnContainer}>
                  <Button
                    icon={isPlaying ? "pause" : "play"}
                    iconColor="black"
                    onPressIn={() =>
                      dispatch(
                        togglePlayback({ sound, isPlaying, playbackPosition })
                      )
                    }
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.trackPreviewLeft}>
              <Icon style={{ opacity: 0.5 }} name="x" />
            </View>
          )}

          {uri && type === "file" ? (
            <View style={styles.trackPreviewRight}>
              {soundLevels.length !== 0 ? (
                <SoundBar
                  canvasWidth={waveWidth - 120}
                  duration={duration}
                  playbackPosition={playbackPosition}
                  barData={soundLevels}
                  onSeek={(position) => {
                    dispatch(onSliderValueChange({ sound, position }));
                  }}
                  isRecording={isRecording}
                />
              ) : (
                <>
                  <CustomText style={styles.spotifySongHeader}>
                    {fileName}
                  </CustomText>
                  <CustomText style={styles.spotifySongArtist}>
                    {extension}
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
        {uri && !isRecording && soundLevels.length === 0 && type === "file" && (
          <View style={{ top: 32 }}>
            <LineSoundBar
              canvasWidth={waveWidth}
              duration={duration}
              playbackPosition={playbackPosition}
              onSeek={(position) => {
                dispatch(onSliderValueChange({ sound, position }));
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
