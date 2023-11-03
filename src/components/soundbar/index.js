import React from "react";
import { Canvas, Line, vec } from "@shopify/react-native-skia";
import { View, TouchableOpacity, PanResponder } from "react-native";

const SoundBar = ({
  barData,
  duration,
  playbackPosition,
  onSeek,
  isRecording,
}) => {
  // Constants for canvas size and calculation
  const canvasWidth = 300;
  const canvasHeight = 50;
  const barWidth = 3; // Width of the bars
  const gap = 2; // Space between bars

  const handlePress = (event) => {
    const x = event.nativeEvent.locationX;
    const percentage = x / canvasWidth;
    const seekPosition = percentage * duration;
    onSeek(seekPosition);
  };

  const playbackPercentage = (playbackPosition / duration) * 100;
  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View
        style={{
          borderRadius: 10,
          overflow: "hidden",

          width: 300,

          height: 50,
          backgroundColor: "#000",
        }}
      >
        <Canvas
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {(isRecording ? barData.slice().reverse() : barData).map(
            (data, index) => {
              // Ensure the value is non-negative

              const absoluteValue = Math.max(data.rawValue + 45, 1);
              console.log(absoluteValue);

              const normalizedValue = (absoluteValue / 40) * canvasHeight; // 40 is the max value expected

              // Calculate the height of the bar relative to the canvasHeight
              const barHeight = Math.max(normalizedValue, 1) * 0.7; // Ensure a minimum height

              const xPos = index * (barWidth + gap) + 2; // Modified this line

              const barIndexPercentage = (index / barData.length) * 100;
              const barColor = isRecording
                ? "#FFB945"
                : barIndexPercentage <= playbackPercentage
                ? "#fff"
                : "#555"; // #fff is active, #555 is inactive

              return (
                <Line
                  key={data.id}
                  p1={vec(xPos, canvasHeight - (canvasHeight - barHeight) / 2)} // Adjusted start point
                  p2={vec(xPos, (canvasHeight - barHeight) / 2)} // Adjusted end point
                  color={barColor}
                  style="stroke"
                  strokeWidth={barWidth} // Width of the bar
                  lineCap="round"
                />
              );
            }
          )}
        </Canvas>
      </View>
    </TouchableOpacity>
  );
};

export default SoundBar;
