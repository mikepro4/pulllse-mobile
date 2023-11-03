import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Theme from "../../styles/theme";
import CustomText from "../text";

const BPMTap = () => {
  const player = useSelector((state) => state.player);
  const [bpm, setBpm] = useState(0);
  const [tapTimes, setTapTimes] = useState([]);

  const handleTap = () => {
    const now = Date.now();
    setTapTimes((prevTapTimes) => {
      const newTapTimes = [...prevTapTimes, now].slice(-4); // Keep last 4 taps
      if (newTapTimes.length > 1) {
        const intervals = newTapTimes
          .slice(1)
          .map((t, i) => t - newTapTimes[i]);
        const avgInterval =
          intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const newBpm = Math.round(60000 / avgInterval);
        setBpm(newBpm);
      }
      return newTapTimes;
    });
  };

  return (
    <View style={styles.tapContainer}>
      <TouchableOpacity style={styles.tapButtonContainer} onPress={handleTap}>
        <CustomText style={styles.tapText}>TAP</CustomText>
      </TouchableOpacity>

      <View style={styles.bpmContainer}>
        <CustomText style={styles.bpmText}>
          {bpm ? `${bpm} bpm` : "Tap to start"}
        </CustomText>
      </View>
    </View>
  );
};

export default BPMTap;

const styles = StyleSheet.create({
  tapContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 280,
  },

  tapButtonContainer: {
    width: 75,
    height: 75,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Theme.green,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(41, 255, 127, 0.1)",
  },

  bpmContainer: {
    position: "relative",
    marginTop: 20,
  },

  bpmText: {
    fontSize: 20,
    fontFamily: "london",
    color: Theme.green,
    position: "relative",
    top: 1,
    // textShadowColor: '#0F0',
    // textShadowOffset: { width: 0, height: 0 },
    // textShadowRadius: 10,
  },
  tapText: {
    letterSpacing: 2,
    fontSize: 12,
    position: "relative",
    left: 2,
  },
});
