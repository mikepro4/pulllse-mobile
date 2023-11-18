import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect } from "react-native-svg";
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
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Icon from "../../components/icon";
import CustomText from "../../components/text";

//const { width } = Dimensions.get("window");
//const SLIDER_WIDTH = width * 0.9; // 90% of screen width
const SLIDER_HEIGHT = 30;
const PADDING_HORIZONTAL = 15;
const TICK_COUNT = 20;
//const TICK_INTERVAL = SLIDER_WIDTH / 20;

const Slider = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const TICK_INTERVAL = containerWidth / TICK_COUNT;
  const translateX = useSharedValue(0);
  //console.log("translateX", translateX);
  const contextX = useSharedValue(0);
  const lastIntervalIndex = useSharedValue(-1);
  const cumulativeMovement = useSharedValue(0);
  const maxTranslateX = containerWidth / 2;
  const numberMeter = 360;
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - 2 * PADDING_HORIZONTAL); // Set the container width
  };

  const onPlus = () => {
    const newValue = translateX.value + TICK_INTERVAL;
    translateX.value = withSpring(
      Math.min(Math.max(newValue, -maxTranslateX), maxTranslateX)
    );
  };
  const onMinus = () => {
    const newValue = translateX.value - TICK_INTERVAL;
    translateX.value = withSpring(
      Math.min(Math.max(newValue, -maxTranslateX), maxTranslateX)
    );
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      contextX.value = translateX.value; // Store the current position
    })
    .onUpdate((event) => {
      const newValue = contextX.value + event.translationX;
      translateX.value = Math.min(
        Math.max(newValue, -maxTranslateX),
        maxTranslateX
      );

      // const TOLERANCE = 0.2;
      // const division = newValue / TICK_INTERVAL;
      // const divisionFloor = Math.floor(division);
      // if (Math.abs(division - divisionFloor) < TOLERANCE) {
      //   console.log("trig");
      //   runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      //   cumulativeMovement.value = 0;
      // }
      // if (currentIntervalIndex !== lastIntervalIndex.value) {
      //   lastIntervalIndex.value = currentIntervalIndex;
      // runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      // }
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

  const Text = (
    <View style={styles.numbersContainer}>
      <CustomText style={styles.font}>{-numberMeter}</CustomText>
      <CustomText style={styles.font}>{-numberMeter / 2}</CustomText>
      <CustomText style={[styles.font, { marginRight: 7 }]}>0</CustomText>
      <CustomText style={styles.font}>{numberMeter / 2}</CustomText>
      <CustomText style={styles.font}>{numberMeter}</CustomText>
    </View>
  );

  return (
    <>
      <View style={styles.container} onLayout={onLayout}>
        <Svg
          height={SLIDER_HEIGHT}
          width={containerWidth + 2}
          style={{ overflow: "hidden" }}
        >
          {Array.from({ length: TICK_COUNT + 1 }, (_, i) => (
            <Rect
              key={i}
              x={TICK_INTERVAL * i}
              y="0"
              width="2"
              height={SLIDER_HEIGHT}
              fill={"rgba(255, 255, 255, 0.10)"}
            />
          ))}
        </Svg>
        <GestureDetector gesture={combinedGesture}>
          <Animated.View
            style={[
              styles.sliderHandle,
              animatedStyle,
              { left: containerWidth / 2 - 2 },
            ]}
          >
            <View style={styles.centeredLine} />
          </Animated.View>
        </GestureDetector>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={onMinus}>
            <View style={styles.adjustButton}>
              <Icon name={"minus"} style={{ width: 22, height: 22 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlus}>
            <View style={styles.adjustButton}>
              <Icon name={"plus"} style={{ width: 22, height: 22 }} />
            </View>
          </TouchableOpacity>
        </View>
        {Text}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  font: { fontSize: 10, color: "#fff", opacity: 0.5 },
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
    gap: 7,
  },
  adjustButton: {
    borderColor: "#282828",
    width: 45,
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
