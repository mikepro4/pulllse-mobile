import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { uploadAudio } from "../redux";
import { useDispatch, useSelector } from "react-redux";

import * as FileSystem from "expo-file-system";

export default function App() {
  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("Recording");

  const [recording, setRecording] = React.useState();
  const [isRecording, setIsRecording] = React.useState(false);
  const [sound, setSound] = React.useState();

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

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // URI of the recorded file
      const { status } = await recording.createNewLoadedSoundAsync();

      // To play the recording
      const { sound } = await Audio.Sound.createAsync({ uri }, { volume: 1.0 });
      // const formData = new FormData();

      const response = await fetch(uri);
      const fileContent = await response.arrayBuffer();

      dispatch(
        uploadAudio({
          blob: fileContent,
          duration: status.durationMillis,
          name,
        })
      );
      setSound(sound);
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

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Button title="Play Recording" onPress={playRecording} />
      <Text>{isRecording ? "Recording..." : "Not Recording"}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
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
