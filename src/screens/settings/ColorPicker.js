import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Canvas,
  Rect,
  LinearGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useDerivedValue,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import Square from "./Square";
import * as Haptics from "expo-haptics";
import Icon from "../../components/icon";
import CustomText from "../../components/text";

//const { width } = Dimensions.get("window");
//const SLIDER_WIDTH = width * 0.9; // 90% of screen width
const SLIDER_HEIGHT = 30;
const PADDING_HORIZONTAL = 15;
const TICK_COUNT = 20;
const HUE_MAX = 360;
//const TICK_INTERVAL = SLIDER_WIDTH / 20;

const Slider = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentHue, setCurrentHue] = useState(0);
  const [currentS, setCurrentS] = useState(100);
  const [currentB, setCurrentB] = useState(100);

  const TICK_INTERVAL = containerWidth / TICK_COUNT;
  const translateX = useSharedValue(0);
  //console.log("translateX", translateX);
  const contextX = useSharedValue(0);
  const lastIntervalIndex = useSharedValue(-1);
  const cumulativeMovement = useSharedValue(0);
  const maxTranslateX = containerWidth;
  const numberMeter = 360;
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 2 * PADDING_HORIZONTAL); // Set the container width
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      contextX.value = translateX.value; // Store the current position
    })
    .onUpdate((event) => {
      const newValue = contextX.value + event.translationX;
      translateX.value = Math.min(Math.max(newValue, 0), maxTranslateX);
      const hue = (translateX.value / maxTranslateX) * HUE_MAX;
      runOnJS(setCurrentHue)(hue);
    });
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      translateX.value = withSpring(0);
    });

  const combinedGesture = Gesture.Exclusive(panGesture, doubleTapGesture);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  function hsbToRgb(h, s, v) {
    // Renamed 'b' to 'v' for brightness to avoid conflict with 'b' for blue
    s /= 100;
    v /= 100;
    let k = (n) => (n + h / 60) % 6;
    let f = (n) => v * (1 - s * Math.max(Math.min(k(n), 4 - k(n), 1), 0));
    let r = Math.round(f(5) * 255);
    let g = Math.round(f(3) * 255);
    let b = Math.round(f(1) * 255); // This is the only declaration of 'b' now
    return `rgb(${r}, ${g}, ${b})`;
  }

  function convertHsbArrayToRgbArray(hsbArray) {
    return hsbArray.map((color) => hsbToRgb(color.h, color.s, color.b));
  }

  const colorsHSB = [
    { h: 0, s: 100, b: 100 }, // Red
    { h: 60, s: 100, b: 100 }, // Orange
    { h: 120, s: 100, b: 100 }, // Yellow
    { h: 180, s: 100, b: 100 }, // Green
    { h: 240, s: 100, b: 100 }, // Blue
    { h: 300, s: 100, b: 100 }, // Indigo
    { h: 360, s: 100, b: 100 }, // Violet
  ];

  const colorsRGB = convertHsbArrayToRgbArray(colorsHSB);

  const rColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      translateX.value,
      colorsRGB.map((_, i) => (i / (colorsRGB.length - 1)) * maxTranslateX),
      colorsRGB
    );
    console.log("color", translateX.value);
    return { backgroundColor: color };
  });

  return (
    <>
      <View style={styles.container} onLayout={onLayout}>
        <Canvas style={{ height: SLIDER_HEIGHT, width: containerWidth + 2 }}>
          <Rect x={0} y={0} height={SLIDER_HEIGHT} width={containerWidth + 2}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(256, 0)}
              colors={colorsRGB}
            />
          </Rect>
        </Canvas>
        <GestureDetector gesture={combinedGesture}>
          <Animated.View
            style={[
              styles.sliderHandle,
              animatedStyle,
              { right: containerWidth },
            ]}
          >
            <View style={styles.centeredLine} />
          </Animated.View>
        </GestureDetector>
        <View style={styles.btnContainer}>
          <Animated.View
            style={[
              styles.colorDisplay,
              { backgroundColor: hsbToRgb(currentHue, currentS, currentB) },
            ]}
          />
        </View>
        <View style={styles.square}>
          <Square
            size={containerWidth}
            hue={currentHue}
            hsbToRgb={hsbToRgb}
            setCurrentHue={setCurrentHue}
            setCurrentS={setCurrentS}
            setCurrentB={setCurrentB}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  square: {
    position: "absolute",
    top: 100,
  },
  font: { fontSize: 10, color: "#fff", opacity: 0.5 },
  colorDisplay: {
    width: 97,
    height: 45,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#282828",
    alignItems: "center",
    justifyContent: "center",
    // Additional styling for the color display view
  },
  numbersContainer: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    top: 50,
    fontSize: 5,
  },
  btnContainer: {
    position: "absolute",
    left: "103%",
    flexDirection: "row",
  },
  adjustButton: {
    borderColor: "#282828",
    width: 97,
    height: 45,
    borderRadius: 5,
    borderWidth: 2,

    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 120,

    // paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#282828",
  },
  sliderHandle: {
    position: "absolute",
    // left: SLIDER_WIDTH / 2 - 5, // Initial position in the center
    width: 30,
    height: SLIDER_HEIGHT + 30,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
    //alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically
  },
  centeredLine: {
    position: "absolute",
    height: SLIDER_HEIGHT, // Line height as tall as the handle
    borderLeftWidth: 2, // Line thickness
    borderLeftColor: "white", // Line color

    marginLeft: -1,
    left: "50%", // Set left to 50% of the parent container
  },
});

export default Slider;
