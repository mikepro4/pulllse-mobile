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
import { Linking, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../../config";
import { Audio } from "expo-av";
import LineSoundBar from "../soundbar/lineSoundbar";
import * as Clipboard from "expo-clipboard";

import { addPulseRecording } from "../../redux";

import CustomText from "../text";
import Icon from "../icon";

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
  const [isFocused, setIsFocused] = useState(false);
  const [trackUrl, setTrackUrl] = useState("");
  console.log("trackurl", trackUrl);

  const [spotifyTrack, setSpotifyTrack] = useState();
  const clearSpotifyTrack = async () => {
    setSpotifyTrack(null);
    setSound(undefined);
    setTrackUrl("");
    setIsPlaying(false);
    setPlaybackPosition(0);
    setDuration(0);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  useEffect(() => {
    return async () => {
      if (sound) {
        await sound.unloadAsync();
        dispatch(
          addPulseRecording({
            duration,
            type: "spotify",
            soundLevels: null,
            link: trackUrl,
          })
        );
        sound
          .unloadAsync()
          .then(() => {
            console.log("Sound unloaded successfully");
          })
          .catch((error) => {
            console.error("Failed to unload sound", error);
          });
      }
    };
  }, [sound]);

  useEffect(() => {
    return () => {
      clearSpotifyTrack();
    };
  }, []);

  const handleOpenSpotifyLink = () => {
    const spotifyLink = spotifyTrack?.external_urls.spotify;
    Linking.canOpenURL(spotifyLink)
      .then((supported) => {
        if (supported) {
          Linking.openURL(spotifyLink);
        } else {
          console.log("Don't know how to open URI: " + spotifyLink);
        }
      })
      .catch((err) => console.error("An error occurred", err));
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

  function getSpotifyTrackID(link) {
    const match = link.match(/track\/([a-zA-Z0-9]+)\?/);
    return match ? match[1] : null;
  }

  const getTrack = async (pastedLink) => {
    try {
      const link = pastedLink ? pastedLink : await Clipboard.getStringAsync();

      const token = await AsyncStorage.getItem("accessToken");

      const id = getSpotifyTrackID(link);
      setTrackUrl(config.spotifyURL + id + "?market=us");
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

  const handlePasteAndFetch = () => {
    if (trackUrl) {
      getTrack(trackUrl);
    } else {
      console.log("No URL provided");
    }
  };

  const spotifyIcon = (
    <TouchableOpacity onPress={handleOpenSpotifyLink}>
      <Icon name="spotifyIcon" style={{ width: 30, height: 30 }} />
    </TouchableOpacity>
  );

  const trashIcon = (
    <TouchableOpacity onPress={clearSpotifyTrack}>
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
      <TouchableOpacity onPress={togglePlayback}>
        <Image
          source={{ uri: spotifyTrack?.album.images[1].url }}
          style={styles.image} // Adjust the size as needed
        />
      </TouchableOpacity>

      <View style={styles.trackPreviewRight}>
        <CustomText style={styles.spotifySongHeader}>
          {spotifyTrack?.name}
        </CustomText>
        <CustomText style={styles.spotifySongArtist}>
          {spotifyTrack?.artists.map((artist) => artist.name).join(", ")}
        </CustomText>
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
        style={[
          styles.editorContainer,
          !spotifyTrack && styles.editorContainerBorder,
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
                spotifyTrack
                  ? spotifyTrack?.external_urls.spotify
                  : "Paste track URL here...."
              }
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={(text) => setTrackUrl(text)}
              value={trackUrl}
              onSubmitEditing={handlePasteAndFetch}
            ></TextInput>
          </View>
          {spotifyTrack && trashIcon}
        </View>
        {spotifyTrack ? component1 : skeleton}
        {spotifyTrack && (
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
