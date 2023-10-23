import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch } from "react-redux";
import { deleteAudio } from "../../redux";

const UserPosts = ({ storedUserInfo, userId, audioList }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(null);
  const dispatch = useDispatch();

  const setPlayer = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  };

  useEffect(() => {
    setPlayer();
  }, []);

  async function toggleSound(id, url) {
    if (isPlaying === id) {
      await stopSound();
    } else {
      if (sound) {
        await stopSound();
      }
      await playSound(id, url);
    }
  }

  async function playSound(id, url) {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);
    setIsPlaying(id);

    sound.setOnPlaybackStatusUpdate(async (playbackStatus) => {
      if (playbackStatus.didJustFinish) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(null);
      }
    });

    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync();
    setSound(null);
    setIsPlaying(null);
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
                <Text>{audio.name}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    title={isPlaying === audio._id ? "Pause" : "Play"}
                    onPress={() => toggleSound(audio._id, audio.audioLink)}
                  />
                  {storedUserInfo === userId && (
                    <Button
                      title="Delete"
                      onPress={() => handleDelete(audio.audioLink)}
                    />
                  )}
                </View>
                <Text>Duration: {getDurationFormatted(audio.duration)}</Text>
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
    marginRight: 10,
    marginBottom: 30,
  },
});
