import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import SoundBar from "../soundbar";
import { Audio } from "expo-av";
import Button from "../../components/button";
import LineSoundbar from "../soundbar/lineSoundbar";
import CustomText from "../text";
import Icon from "../icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const PulsePlayer = ({ data }) => {
  const { duration, soundLevels, link: uri, type, extension, fileName } = data;

  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [spotifyTrack, setSpotifyTrack] = useState();
  console.log(spotifyTrack?.preview_url);

  console.log("PulsePlayer", type);

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

  const initialCall = async () => {
    if (type === "spotify") {
      await getTrack(uri);
    } else {
      loadAudio(uri);
    }
  };
  useEffect(() => {
    return async () => {
      if (sound) {
        await sound.stopAsync();
        if (sound._loaded) {
          await sound.unloadAsync();
        }
      }
    };
  }, [sound]);
  useEffect(() => {
    initialCall();
  }, []);

  function getSpotifyTrackID(link) {
    const match = link.match(/track\/([a-zA-Z0-9]+)\?/);
    return match ? match[1] : null;
  }

  const getTrack = async (pastedLink) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      const response = await axios.get(pastedLink, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpotifyTrack(response.data);
      loadAudio(response.data.preview_url);
    } catch (error) {
      console.error("Error fetching track:", error);
    }
  };

  const loadAudio = async (theLink) => {
    console.log("thelink", theLink);
    const { sound } = await Audio.Sound.createAsync({ uri: theLink });
    setSound(sound);
  };
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
  const playPause = (
    <View style={styles.btnContainer}>
      <Button
        icon={isPlaying ? "pause" : "play"}
        iconColor="black"
        onPressIn={togglePlayback}
      />
    </View>
  );
  const soundBarView = (
    <SoundBar
      duration={duration}
      playbackPosition={playbackPosition}
      barData={soundLevels}
      onSeek={(position) => {
        onSliderValueChange(position);
      }}
      isRecording={false}
    />
  );
  const spotifyIcon = (
    <View style={styles.spotifyIcon}>
      <TouchableOpacity onPress={handleOpenSpotifyLink}>
        <Icon name="spotifyIcon" style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    </View>
  );

  const lineBar = (
    <View style={styles.line}>
      <LineSoundbar
        duration={duration}
        playbackPosition={playbackPosition}
        onSeek={(position) => {
          onSliderValueChange(position);
        }}
      />
    </View>
  );
  const imageToggle = (
    <>
      <TouchableOpacity onPress={togglePlayback}>
        <Image
          source={{ uri: spotifyTrack?.album.images[1].url }}
          style={styles.image} // Adjust the size as needed
        />
      </TouchableOpacity>
      {spotifyIcon}
    </>
  );
  return (
    <View style={styles.container}>
      {type === "spotify" ? <>{imageToggle}</> : playPause}

      <View style={{ paddingLeft: 12 }}>
        {type === "spotify" ? (
          <>
            <CustomText style={styles.spotifySongHeader}>
              {spotifyTrack?.name}
            </CustomText>
            <CustomText style={styles.spotifySongArtist}>
              {spotifyTrack?.artists.map((artist) => artist.name).join(", ")}
            </CustomText>
            {lineBar}
          </>
        ) : soundLevels?.length !== 0 ? (
          soundBarView
        ) : (
          <>
            <CustomText style={styles.spotifySongHeader}>{fileName}</CustomText>
            <CustomText style={styles.spotifySongArtist}>
              {extension}
            </CustomText>
            {lineBar}
          </>
        )}
      </View>
    </View>
  );
};

export default PulsePlayer;

const styles = StyleSheet.create({
  image: {
    marginLeft: 20,
    width: 50,
    height: 50,

    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  spotifyIcon: {
    position: "absolute",
    right: 0,
  },
  spotifySongHeader: { fontSize: 18, color: "#fff", marginBottom: 2 },
  spotifySongArtist: { fontSize: 14, color: "#777" },
  line: {
    left: -50,
    top: 45,
    position: "absolute",
  },
  container: {
    flex: 1,
    // backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  btnContainer: {
    marginLeft: 20,
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
