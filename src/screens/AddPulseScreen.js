import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import { uploadAudio } from "../redux";
import { useDispatch } from "react-redux";
import * as FileSystem from "expo-file-system";
global.Buffer = global.Buffer || require("buffer").Buffer;

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("Recording");

  const dispatch = useDispatch();

  const createBlobFromAudioFile = async (audioFilePath) => {
    try {
      const fileData = await FileSystem.readAsStringAsync(audioFilePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = new Blob([new Uint8Array(Buffer.from(fileData, "base64"))], {
        type: "audio/x-caf",
      });

      return blob;
    } catch (error) {
      console.error("Error creating blob from audio file:", error);
      throw error;
    }
  };

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  async function stopRecording() {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();

      let updatedRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });

      const uri = recording.getURI();

      const formatedUri = uri.replace("file:///", "");
      const newUri = "/" + formatedUri;
      console.log(newUri);
      const fileData = await FileSystem.readAsStringAsync(newUri);

      const blob = await fetch(newUri).then((response) => response.blob());

      await dispatch(uploadAudio(fileData.blob()));

      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Error stopping the recording:", error);
    }
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

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
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
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
