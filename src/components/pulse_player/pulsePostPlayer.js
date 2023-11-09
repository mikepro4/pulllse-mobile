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

const PulsePlayer = ({
  data,
  toggleSound,
  playbackPosition,
  onPostSliderValueChange,

  isPlaying,
}) => {
  let artist, imgUri, name, deepLink;
  if (data && data.track) {
    ({ artist, imgUri, name, deepLink } = data.track);
  } else {
    artist = "";
    imgUri = "";
    name = "";
    deepLink = "";
  }
  const { duration, soundLevels, type, extension, fileName, audioLink } = data;

  const [waveWidth, setWaveWidth] = useState(100);

  const onEditorRightLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWaveWidth(width);
  };

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
      disabled={!isPlaying}
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
        canvasWidth={waveWidth - 50 || 100}
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
            {isPlaying && lineBar}
          </>
        ) : soundLevels?.length !== 0 ? (
          soundBarView
        ) : (
          <>
            <CustomText style={styles.spotifySongHeader}>{fileName}</CustomText>
            <CustomText style={styles.spotifySongArtist}>
              {extension}
            </CustomText>
            {isPlaying && lineBar}
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
    left: 10,
    top: 45,
    position: "absolute",
  },
  container: {
    marginRight: 10,
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
