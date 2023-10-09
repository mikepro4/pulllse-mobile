import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAudios, deleteAudio } from "../redux";

const FeedScreen = () => {
  const [sound, setSound] = useState();
  const dispatch = useDispatch();
  const audioList = useSelector((state) => state.audio.recordings);

  useEffect(() => {
    dispatch(fetchUserAudios());
  }, []);

  async function playSound(url) {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);

    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync();
    setSound(undefined);
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
      const key = removeBaseUrl(audioLink); // Extract key from the audioLink
      dispatch(deleteAudio(key));
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>FeedScreen</Text>
        <ScrollView>
          {audioList.map((audio) => (
            <View key={audio._id}>
              <Text>{audio.name}</Text>
              <Button title="Play" onPress={() => playSound(audio.audioLink)} />
              <Button title="Pause" onPress={() => stopSound()} />
              <Button
                title="Delete"
                onPress={() => handleDelete(audio.audioLink)}
              />
              <Text>Duration: {audio.duration}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
