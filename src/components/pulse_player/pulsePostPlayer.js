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
import Button from "../../components/button";
import LineSoundbar from "../soundbar/lineSoundbar";
import CustomText from "../text";
import Icon from "../icon";
import usePlaybackStatusUpdate from "../../hooks/usePlaybackStatusUpdate";
import { Audio } from "expo-av";

import { toggleDrawer } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
// import {
//   togglePostPlayback,
//   setPostIsPlaying,
//   onPostSliderValueChange,
//   loadPostAudio,
// } from "../../redux";

const PulsePlayer = ({
  data,
  toggleSound,
  playbackPosition,
  onPostSliderValueChange,
  sound,
  isPlaying,
}) => {
  console.log(data);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [sound, setSound] = useState(null);
  // const [playbackPosition, setPlaybackPosition] = useState(0);
  let artist, imgUri, name, deepLink;

  if (data && data.track) {
    // Destructure only if data and data.track exist
    ({ artist, imgUri, name, deepLink } = data.track);
  } else {
    // Handle the case where data.track is not available
    // Maybe set default values or leave them undefined
    artist = "";
    imgUri = ""; // Default image path or URI
    name = "";
    deepLink = ""; // Default link or action
  }
  const { duration, soundLevels, type, extension, fileName, audioLink } = data;

  const dispatch = useDispatch();

  const [waveWidth, setWaveWidth] = useState(100);

  const onEditorRightLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWaveWidth(width);
  };
  // usePlaybackStatusUpdate(sound);

  // useEffect(() => {
  //   return async () => {
  //     if (sound) {
  //       await sound.stopAsync();
  //       setIsPlaying(false);
  //     }
  //   };
  // }, [sound]);

  const handleOpenSpotifyLink = () => {
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

  // const loadPostAudio = async () => {
  //   try {
  //     const { sound: newSound } = await Audio.Sound.createAsync(
  //       { uri: audioLink },
  //       {}, // Your initial status if needed
  //       (status) => {
  //         if (status.isLoaded && status.didJustFinish) {
  //           // Handle completion of playback
  //         }
  //       }
  //     );
  //     setSound(newSound);
  //   } catch (error) {
  //     console.error("Error loading audio:", error);
  //     // Handle the error, possibly update the UI to inform the user
  //   }
  // };

  // const togglePostPlayback = async () => {
  //   if (!sound) {
  //     await loadPostAudio();
  //   }
  //   if (isPlaying) {
  //     await sound.pauseAsync();
  //   } else {
  //     await sound.setPositionAsync(playbackPosition);
  //     await sound.playAsync();
  //   }
  //   return setIsPlaying(!isPlaying); // Toggle the isPlaying state
  // };

  // const onPostSliderValueChange = async (position) => {
  //   if (sound) {
  //     await sound.setPositionAsync(position);
  //   }
  //   return setPlaybackPosition(position);
  // };

  const playPause = (
    <View style={styles.btnContainer}>
      <Button
        icon={isPlaying ? "pause" : "play"}
        iconColor="black"
        onPressIn={() => {
          toggleSound(data._id, audioLink);
        }}
      />
    </View>
  );

  const soundBarView = (
    <SoundBar
      canvasWidth={waveWidth ? waveWidth - 92 : 200}
      duration={duration}
      playbackPosition={playbackPosition}
      barData={soundLevels}
      onSeek={(position) => {
        onPostSliderValueChange(data._id, position);
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
        canvasWidth={waveWidth + 30 || 100}
        duration={duration}
        playbackPosition={playbackPosition}
        onSeek={(position) => {
          onPostSliderValueChange(data._id, position);
        }}
        disabled={!isPlaying}
      />
    </View>
  );
  const imageToggle = (
    <>
      <TouchableOpacity onPress={() => toggleSound(data._id, audioLink)}>
        <Image
          source={{ uri: imgUri }}
          style={styles.image} // Adjust the size as needed
        />
      </TouchableOpacity>
      {spotifyIcon}
    </>
  );
  return (
    <View style={styles.container} onLayout={onEditorRightLayout}>
      {type === "spotify" ? <>{imageToggle}</> : playPause}

      <View style={{ paddingLeft: 12 }}>
        {type === "spotify" ? (
          <>
            <CustomText style={styles.spotifySongHeader}>{name}</CustomText>
            <CustomText style={styles.spotifySongArtist}>{artist}</CustomText>
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
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});
