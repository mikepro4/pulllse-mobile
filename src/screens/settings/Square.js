import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from "react-native-gesture-handler";
import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";

import {
  Canvas,
  Rect,
  LinearGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useDerivedValue,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";

const SaturationBrightnessSquare = ({
  hue,
  size,
  hsbToRgb,
  setCurrentS,
  setCurrentB,
}) => {
  const saturation = useSharedValue(100); // Saturation starts at 100%
  const contextS = useSharedValue(0); // Saturation starts at 100%
  const contextB = useSharedValue(0); // Saturation starts at 100%
  const brightness = useSharedValue(100); // Brightness starts at 100%
  console.log("hue", (hue * 100) / 360);
  // ... other state and shared values

  const setColors = (newS, newB) => {
    setCurrentS(newS);
    setCurrentB(newB);
  };

  // Handle the gesture on the square
  const sbGesture = Gesture.Pan()
    .onBegin(() => {
      contextS.value = saturation.value; // Store the current saturation
      contextB.value = brightness.value; // Store the current brightness
    })
    .onUpdate((event) => {
      // Calculate new saturation and brightness based on the gesture
      const newSaturation = contextS.value + (event.translationX / size) * 100;
      const newBrightness = contextB.value - (event.translationY / size) * 100; // Subtract because y-axis is inverted

      // Clamp the values to ensure they stay within the range of 0 to 100
      saturation.value = Math.min(Math.max(newSaturation, 0), 100);
      brightness.value = Math.min(Math.max(newBrightness, 0), 100);

      runOnJS(setColors)(newSaturation, newBrightness);

      //   runOnJS(setCurrentB)(newBrightness);
    });

  // Calculate the current color based on the hue, saturation, and brightness
  const currentColor = hsbToRgb(hue, 100, 100);

  const rSelectorStyle = useAnimatedStyle(() => {
    // Translate the selector based on saturation and brightness
    const selectorX =
      (saturation.value / 100) * size - styles.selector.width / 2;
    const selectorY =
      (1 - brightness.value / 100) * size - styles.selector.height / 2;

    let s = saturation.value / 100;

    let v = brightness.value / 100;

    let k = (n) => (n + hue / 60) % 6;

    let f = (n) => v * (1 - s * Math.max(Math.min(k(n), 4 - k(n), 1), 0));

    let r = Math.round(f(5) * 255);
    let g = Math.round(f(3) * 255);
    let b = Math.round(f(1) * 255);

    return {
      transform: [{ translateX: selectorX }, { translateY: selectorY }],
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
    };
  });
  return (
    <View>
      {/* Render the gradient square */}
      <Canvas style={{ width: size, height: size }}>
        {/* Vertical gradient from black to transparent */}

        {/* Horizontal gradient from white to the selected hue */}
        <Rect x={0} y={0} width={size} height={size}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(256, 0)}
            colors={["white", currentColor]}
          />
        </Rect>
        <Rect x={0} y={0} width={size} height={size}>
          <LinearGradient
            start={vec(0, 256)}
            end={vec(0, 0)}
            colors={["black", "transparent"]}
          />
        </Rect>
      </Canvas>
      <GestureDetector gesture={sbGesture}>
        <Animated.View style={[styles.selector, rSelectorStyle]} />
      </GestureDetector>
    </View>
  );
};

// ... styles and other component code

export default SaturationBrightnessSquare;
const styles = StyleSheet.create({
  // ... other styles
  selector: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15, // Circular selector
    borderWidth: 2,
    borderColor: "#FFF", // White border for visibility
    backgroundColor: "#FFF", // Default background color
    // Add a shadow or another form of highlight to ensure the selector is visible on all backgrounds
  },
  // ... other styles
});
