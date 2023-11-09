import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme";
import { Linking, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../../config";
import LineSoundBar from "../soundbar/lineSoundbar";
import * as Clipboard from "expo-clipboard";

import {
  resetPulseRecording,
  loadAudio,
  togglePlayback,
  onSliderValueChange,
} from "../../redux";

import CustomText from "../text";
import Icon from "../icon";

const RecordingEditor = () => {
  const sound = useSelector((state) => state.pulseRecording.sound);
  const isPlaying = useSelector((state) => state.pulseRecording.isPlaying);
  const { artist, imgUri, name, deepLink } = useSelector(
    (state) => state.pulseRecording.track
  );
  const duration = useSelector((state) => state.pulseRecording.duration);
  const playbackPosition = useSelector(
    (state) => state.pulseRecording.playbackPosition
  );
  const dispatch = useDispatch();

  const [isFocused, setIsFocused] = useState(false);
  const [waveWidth, setWaveWidth] = useState();
  const [trackUrl, setTrackUrl] = useState("");
  const [err, setErr] = useState("");
  console.log(err);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOpenSpotifyLink = () => {
    // const spotifyLink = spotifyTrack?.external_urls.spotify;
    Linking.canOpenURL(deepLink)
      .then((supported) => {
        if (supported) {
          Linking.openURL(deepLink);
        } else {
          console.log("Don't know how to open URI: " + deepLink);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  function getSpotifyTrackID(link) {
    const match = link.match(/track\/([a-zA-Z0-9]+)\?/);
    return match ? match[1] : null;
  }

  const getTrack = async (pastedLink) => {
    if (sound) {
      dispatch(resetPulseRecording());
    }
    try {
      const link = pastedLink ? pastedLink : await Clipboard.getStringAsync();

      const token = await AsyncStorage.getItem("accessToken");

      const id = getSpotifyTrackID(link);
      const response = await axios.get(config.spotifyURL + id + "?market=us", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(
        loadAudio({
          uri: response.data.preview_url,
          link: config.spotifyURL + id + "?market=us",
          type: "spotify",
          track: {
            imgUri: response.data.album.images[1].url,
            name: response.data.name,
            deepLink: response.data.external_urls.spotify,
            artist: response.data.artists
              .map((artist) => artist.name)
              .join(", "),
          },
        })
      );
      setErr("");
    } catch (error) {
      setTrackUrl("");

      setErr("Invalid spotify track URL");
    }
  };

  const handlePasteAndFetch = () => {
    if (trackUrl) {
      getTrack(trackUrl);
    } else {
      console.log("No URL provided");
    }
  };
  const onEditorRightLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWaveWidth(width);
  };

  const spotifyIcon = (
    <TouchableOpacity onPress={handleOpenSpotifyLink}>
      <Icon name="spotifyIcon" style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );

  const trashIcon = (
    <TouchableOpacity
      onPress={() => {
        setTrackUrl("");
        dispatch(resetPulseRecording());
      }}
    >
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

  const component1 = (
    <View style={styles.trackPreviewContainer}>
      <TouchableOpacity
        onPress={() =>
          dispatch(togglePlayback({ sound, isPlaying, playbackPosition }))
        }
      >
        <Image source={{ uri: imgUri }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.trackPreviewRight}>
        <CustomText style={styles.spotifySongHeader}>{name}</CustomText>
        <CustomText style={styles.spotifySongArtist}>{artist}</CustomText>
        <View style={styles.spotifyIcon}>{spotifyIcon}</View>
      </View>
    </View>
  );
  const skeleton = (
    <View style={styles.trackPreviewContainer}>
      <View style={styles.trackPreviewLeft}>
        <Icon style={{ opacity: 0.5 }} name="x" />
      </View>
      <View style={styles.trackPreviewRight}>
        <View style={styles.trackTitle}></View>
        <View style={styles.artistName}></View>
      </View>
    </View>
  );

  return (
    <>
      <View
        onLayout={onEditorRightLayout}
        style={[
          styles.editorContainer,
          !imgUri && styles.editorContainerBorder,
        ]}
      >
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.urlContainer, isFocused && styles.activeBorder]}>
            <TouchableOpacity onPress={() => getTrack()}>
              <CustomText style={styles.trackUrl}>TRACK URL:</CustomText>
            </TouchableOpacity>
            <TextInput
              style={styles.trackUrlInput}
              placeholder={
                err
                  ? "Error"
                  : deepLink && !err
                  ? deepLink
                  : "Paste track URL here...."
              }
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={(text) => setTrackUrl(text)}
              value={trackUrl}
              onSubmitEditing={() => {
                handlePasteAndFetch();
                setTrackUrl("");
              }}
            ></TextInput>
          </View>
          {imgUri && trashIcon}
        </View>
        {imgUri ? component1 : skeleton}
        {imgUri && (
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
        {err ? <CustomText style={styles.errText}>{err}</CustomText> : null}
      </View>
    </>
  );
};

export default RecordingEditor;

const styles = StyleSheet.create({
  errText: { fontSize: 14, color: "red", top: 50 },
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
  spotifyIcon: {
    position: "absolute",
    right: 10,
  },
  spotifySongHeader: { fontSize: 18, color: "#fff", marginBottom: 2 },
  spotifySongArtist: { fontSize: 14, color: "#777" },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
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
    paddingRight: 80,
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
  editorContainerBorder: {
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
  },
  editorContainer: {
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
    // alignItems: "center",
    position: "relative",
    // flexDirection: "row",
    height: 142,
  },
});
