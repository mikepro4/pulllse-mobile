import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  interpolate,
  runOnJS,
  Extrapolate,
} from "react-native-reanimated";

const Palette = {
  primary: "#27303F",
  secondary: "#9FA7B5",
  background: "#E3ECFA",
};

const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.min(Math.max(value, lowerBound), upperBound);
};

const AnimatedSlider = ({
  pickerSize = 35,
  sliderHeight = 4,
  minValue = 0,
  maxValue = 1,
  color = Palette.primary,
  style,
  onUpdate,
  initialProgress = 0,
  width,
}) => {
  const flattenedStyle = useMemo(() => StyleSheet.flatten(style), [style]);

  const defaultPickerBorderRadius = pickerSize / 2;
  const defaultScale = 0.8;

  const translateX = useSharedValue(initialProgress * width);
  const contextX = useSharedValue(0);
  const scale = useSharedValue(defaultScale);

  const clampedTranslateX = useDerivedValue(
    () => clamp(translateX.value, 0, width),
    []
  );

  useAnimatedReaction(
    () => clampedTranslateX.value,
    (translation) => {
      const progress = interpolate(
        translation,
        [0, width],
        [minValue, maxValue],
        Extrapolate.CLAMP
      );
      if (onUpdate) runOnJS(onUpdate)(progress);
    }
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withTiming(1);
      contextX.value = clampedTranslateX.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
    })
    .onFinalize(() => {
      scale.value = withTiming(defaultScale);
      const finalValue = interpolate(
        clampedTranslateX.value,
        [0, width],
        [minValue, maxValue],
        Extrapolate.CLAMP
      );
      if (onUpdate) runOnJS(onUpdate)(finalValue);
    });
  const rPickerStyle = useAnimatedStyle(() => ({
    borderRadius: defaultPickerBorderRadius,
    transform: [
      { translateX: clampedTranslateX.value - pickerSize / 2 },
      { scale: scale.value },
    ],
  }));

  const rProgressBarStyle = useAnimatedStyle(() => ({
    width: clampedTranslateX.value,
  }));

  return (
    <Animated.View
      style={{
        borderRadius: 5,
        backgroundColor: Palette.secondary,
        ...flattenedStyle,
        height: sliderHeight,
        width: width,
      }}
    >
      <Animated.View
        style={[
          { backgroundColor: color },
          styles.progressBar,
          rProgressBarStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              height: pickerSize,
              top: -pickerSize / 2 + sliderHeight / 2,
            },
            styles.picker,
            rPickerStyle,
          ]}
        />
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  picker: {
    aspectRatio: 1,
    backgroundColor: Palette.primary,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
});

export default AnimatedSlider;
