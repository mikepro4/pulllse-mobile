import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { uploadAudio, createPulse } from "../../redux";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const [name, setName] = useState("Recording");
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  const [blob, setBlob] = useState();
  const [duration, setDuration] = useState();

  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await newRecording.startAsync();

        setRecording(newRecording);
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // URI of the recorded file
      const { status } = await recording.createNewLoadedSoundAsync();

      // To play the recording
      const { sound } = await Audio.Sound.createAsync({ uri }, { volume: 1.0 });
      // const formData = new FormData();

      const response = await fetch(uri);
      setBlob(await response.arrayBuffer());
      setDuration(status.durationMillis);

      setSound(sound);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setIsRecording(false); // Set recording status to false
    } catch (error) {
      console.error(error);
    }
  };

  const playRecording = async () => {
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error(error);
    }
  };

  const createPulse = () => {
    dispatch(
      uploadAudio({
        blob,
        duration,

        callback: (data) => {
          console.log(data._id);

          dispatch(
            createPulse({ name, userId: storedUserInfo._id, audioId: data._id })
          );
        },
      })
    );
    setName("Recording");
  };

  return (
    <View style={{ flex: 1, paddingTop: 150 }}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(value) => setName(value)}
        placeholder="Recording"
      />
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Button title="Play Recording" onPress={playRecording} />
      <Button title="Create Pulse" onPress={createPulse} />
      <Text>{isRecording ? "Recording..." : "Not Recording"}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // white background
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});
