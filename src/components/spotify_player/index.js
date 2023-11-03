import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { getDurationFormatted } from "../../utils/getDurationFormated";
import { Linking, Image } from "react-native";
import Slider from "@react-native-community/slider";
import CustomText from "../../components/text";
import Icon from "../../components/icon";
import Button from "../../components/button";

const SpotifyPlayer = ({
  spotifyTrack,
  playbackPosition,
  isPlaying,
  togglePlayback,
  clearSpotifyTrack,
  duration,
  onSliderValueChange,
}) => {
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

  const renderSmallPlayPause = () => {
    if (spotifyTrack) {
      return (
        <View style={styles.smallPlayPause}>
          <Button
            icon={isPlaying ? "pause" : "play"}
            iconColor="white"
            onPressIn={togglePlayback}
          />
        </View>
      );
    }
  };

  return (
    <>
      {spotifyTrack && (
        <View style={styles.sliderContainer}>
          <View style={styles.spotifyLinkContainer}>
            <View style={{ paddingBottom: 10 }}>
              <CustomText style={styles.spotifySongHeader}>
                {spotifyTrack?.name}
              </CustomText>
              <CustomText style={styles.spotifySongArtist}>
                {spotifyTrack?.artists.map((artist) => artist.name).join(", ")}
              </CustomText>
            </View>

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
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={playbackPosition}
            onSlidingComplete={onSliderValueChange}
            minimumTrackTintColor="#ccc"
            maximumTrackTintColor="#444"
          />

          <View style={styles.spotifyImage}>
            <TouchableOpacity onPress={handleOpenSpotifyLink}>
              <Image
                source={{ uri: spotifyTrack?.album.images[2].url }}
                style={styles.image} // Adjust the size as needed
              />
            </TouchableOpacity>
          </View>

          <View style={styles.durationSpotify}>
            {renderSmallPlayPause()}
            <CustomText style={{ fontSize: 14 }}>
              {getDurationFormatted(playbackPosition)}
            </CustomText>
          </View>
        </View>
      )}
    </>
  );
};

export default SpotifyPlayer;

const styles = StyleSheet.create({
  smallPlayPause: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    bottom: -5,
    left: -10,
  },
  durationSpotify: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    alignItems: "center",
    bottom: -35,
    width: 265,
    zIndex: 1,
  },
  image: { width: 50, height: 50 },
  spotifyImage: {
    position: "absolute",
    right: -30,
    top: -5,
  },
  slider: { width: 270, height: 50 },
  sliderContainer: {
    width: 300,
  },
  spotifyLinkContainer: {
    left: 3,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
    bottom: 35,
    width: 275,
    justifyContent: "space-between",
  },
  spotifySongHeader: { fontSize: 16, color: "#fff", marginBottom: 2 },
  spotifySongArtist: { fontSize: 14, color: "#777" },
  trashIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
