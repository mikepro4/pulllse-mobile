import React from "react";
import { View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

const SoundBar = ({
  duration,
  playbackPosition,
  setPlaybackPosition,
  onSeek,
  canvasWidth,
}) => {
  const canvasHeight = 20;
  const lineHeight = 2;
  const lineY = canvasHeight / 2;

  console.log(playbackPosition);
  const progressLineWidth = useSharedValue(
    (playbackPosition / duration) * canvasWidth
  );

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      // Calculate new playback position based on the gesture
      const x = event.translationX;
      const seekPercentage = x / canvasWidth;
      const seekPosition = seekPercentage * duration;

      // Update progress line width and playback position
      progressLineWidth.value = seekPosition;
    })
    .onEnd(() => {
      // Trigger onSeek when the gesture ends
      runOnJS(onSeek)(progressLineWidth.value);
    });

  // Animated style for the progress line
  const animatedProgressLineStyle = useAnimatedStyle(() => ({
    width: progressLineWidth.value,
    height: lineHeight,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: lineY - lineHeight / 2,
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={{ width: canvasWidth, height: canvasHeight }}>
        {/* Background line */}
        <View
          style={{
            position: "absolute",
            bottom: lineY - lineHeight / 2,
            width: canvasWidth,
            height: lineHeight,
            backgroundColor: "#555",
          }}
        />

        {/* Animated Progress line */}
        <Animated.View style={animatedProgressLineStyle} />
      </View>
    </GestureDetector>
  );
};

export default SoundBar;
