import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Audio } from 'expo-av';

const FeedScreen = () => {
  const [audioList, setAudioList] = useState([]);
  const [sound, setSound] = useState();

  useEffect(() => {
    async function fetchAudioData() {
      const user = await AsyncStorage.getItem("userId");

      const response = await fetch(`http://192.168.1.157:4000/api/userAudios?userId=${user}`);
      const data = await response.json();
      setAudioList(data);
    }
    fetchAudioData();
  }, []);

  async function playSound(url) {
    const { sound } = await Audio.Sound.createAsync(
       { uri: url }
    );
    setSound(sound);

    await sound.playAsync(); 
  }

  async function stopSound() {
    await sound.stopAsync();
    setSound(undefined);
  }

  return (
    <SafeAreaView>
      <View>
        <Text>FeedScreen</Text>
        <ScrollView>
          {audioList.map(audio => (
            <View key={audio._id}>
              <Text>{audio.name}</Text>
              <Button title="Play" onPress={() => playSound(audio.audioLink)} />
              <Button title="Pause" onPress={() => stopSound()} />
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
