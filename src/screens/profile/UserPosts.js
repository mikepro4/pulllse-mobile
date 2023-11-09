import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch } from "react-redux";
import { deleteAudio } from "../../redux";
import PulsePlayer from "../../components/pulse_player/pulsePostPlayer";
//data = { pulseRecording };
const UserPosts = ({ storedUserInfo, userId, audioList }) => {
  const [sound, setSound] = useState();
  const [playingStatus, setPlayingStatus] = useState({});

  const [playbackPositions, setPlaybackPositions] = useState({});
  const dispatch = useDispatch();
  console.log("audioList", audioList);

  const setPlayer = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  };

  useEffect(() => {
    setPlayer();
    return async () => {
      // This cleanup function will be called when the component unmounts

      await sound?.unloadAsync(); // Unload the sound
    };
  }, [sound]);

  const onPlaybackStatusUpdate = (status, id) => {
    // No need for the isMounted check here as we'll handle the effect cleanup below
    if (status.isLoaded) {
      if (status.isPlaying) {
        setPlaybackPositions((prevPositions) => ({
          ...prevPositions,
          [id]: status.positionMillis,
        }));
      }
      if (status.didJustFinish) {
        setPlaybackPositions((prevPositions) => ({
          ...prevPositions,
          [id]: 0,
        }));
        setPlayingStatus((prevState) => ({
          ...prevState,
          [id]: false,
        }));
        sound.unloadAsync(); // Unload the sound when finished playing
      }
    }
  };

  async function toggleSound(id, url) {
    const isCurrentlyPlaying = playingStatus[id] || false;
    if (isCurrentlyPlaying) {
      await stopSound();
    } else {
      if (sound) {
        await stopSound();
      }
      await playSound(id, url);
    }
    setPlayingStatus((prevState) => ({
      ...prevState,
      [id]: !isCurrentlyPlaying,
    }));
  }

  const onPostSliderValueChange = async (id, position) => {
    // Update the playback position for the specific audio file
    setPlaybackPositions((prevPositions) => ({
      ...prevPositions,
      [id]: position,
    }));

    // If the audio file being interacted with is the one that's loaded in the sound object
    if (sound && playingStatus[id]) {
      await sound.setPositionAsync(position);
    }
  };

  async function playSound(id, url) {
    setPlaybackPositions({});
    if (sound) {
      await sound.unloadAsync(); // Make sure to unload any previously loaded sound
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      null,
      (status) => onPlaybackStatusUpdate(status, id) // Pass the `id` here
    );
    setSound(newSound);
    setPlayingStatus((prevState) => ({
      ...prevState,
      [id]: true,
    }));

    await newSound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync();
    setSound(null);
    setPlayingStatus((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((key) => (newState[key] = false));
      return newState;
    });
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = (minutes - minutesDisplay) * 60;
    const secondsDisplay =
      seconds < 10 ? `0${Math.round(seconds)}` : Math.round(seconds);
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  const handleDelete = async (audioLink) => {
    function removeBaseUrl(link) {
      if (audioList) {
        const baseUrl =
          "https://my-audio-bucket-111.s3.us-east-2.amazonaws.com/";
        return link.replace(baseUrl, "");
      }
    }
    if (audioLink) {
      const key = removeBaseUrl(audioLink);
      dispatch(deleteAudio({ key, link: audioLink }));
    }
  };
  return (
    <View style={{ height: 450 }}>
      <Text>UserPosts</Text>
      <ScrollView>
        {audioList
          ? audioList.map((audio) => (
              <View key={audio._id} style={styles.postComponent}>
                <PulsePlayer
                  data={audio}
                  toggleSound={toggleSound}
                  playbackPosition={playbackPositions[audio._id] || 0}
                  onPostSliderValueChange={onPostSliderValueChange}
                  sound={sound}
                  // isPlaying={isPlaying}
                  isPlaying={playingStatus[audio._id]}
                />
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
};

export default UserPosts;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postComponent: {
    marginBottom: 50,
  },
});
