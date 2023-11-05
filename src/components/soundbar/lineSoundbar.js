import React from "react";
import { Canvas, Line, vec } from "@shopify/react-native-skia";
import { View, TouchableOpacity, PanResponder } from "react-native";

const SoundBar = ({ duration, playbackPosition, onSeek }) => {
  const canvasWidth = 388; // Width of the canvas
  // // Width of the canvas
  const canvasHeight = 20; // Height of the canvas, touchable area
  const lineHeight = 2; // Height of the line
  const lineY = canvasHeight / 2;

  const handlePress = (event) => {
    const x = event.nativeEvent.locationX; // Get the x position of the touch
    const seekPercentage = x / canvasWidth; // Calculate the percentage of the touch along the canvas width
    const seekPosition = seekPercentage * duration; // Calculate the seek position based on the duration of the audio
    onSeek(seekPosition); // Call the onSeek function with the calculated position
  };
  const progressLineWidth = (playbackPosition / duration) * canvasWidth;

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
          {/* Background line */}
          <Line
            p1={vec(0, lineY)}
            p2={vec(canvasWidth, lineY)}
            color="#555"
            style="stroke"
            strokeWidth={lineHeight}
            lineCap="round"
          />

          {/* Progress line */}
          <Line
            p1={vec(0, lineY)}
            p2={vec(progressLineWidth, lineY)}
            color="#fff"
            style="stroke"
            strokeWidth={lineHeight}
            lineCap="round"
          />
        </Canvas>
      </View>
    </TouchableOpacity>
  );
};

export default SoundBar;
