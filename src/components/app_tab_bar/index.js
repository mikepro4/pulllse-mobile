import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import { switchTab, togglePlayer } from "../../redux/slices/tabSlice";
import Icon from "../icon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { resetScroll, stopScroll } from "../../redux/slices/tabSlice";

import Theme from "../../styles/theme";

const AppTabBar = () => {
  const [initialAnimation, setInitialAnimation] = useState(true);
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(0);
  const navigation = useNavigation();

  const animateOut = () => {
    offset.value = withSpring(85, {
      mass: 1,
      damping: 57,
      stiffness: 450,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
    });
  };

  // Animate tab bar back in when "plus" is deselected
  const animateIn = () => {
    offset.value = withSpring(0, {
      mass: 1,
      damping: 57,
      stiffness: 450,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(1, {
      duration: 200,
    });
  };

  useEffect(() => {
    if (!initialAnimation) {
      if (activeTab.player) {
        animateOut();
      } else {
        animateIn();
      }
    }
  }, [activeTab]); // Re-run effect when activeTab changes

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: opacity.value,
  }));

  const showInitialAnimation = () => {
    opacity.value = withDelay(
      100,
      withTiming(1, {
        duration: 2000,
        easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
      })
    );
  };

  useEffect(() => {
    showInitialAnimation();
    setInitialAnimation(false);

    // dispatch(togglePlayer(true));
  }, []);

  const resetRoutes = () => {
    if (
      navigation.getState() &&
      navigation.getState().routes.length > 1
    ) {
      navigation.dispatch(StackActions.popToTop());
    }
  }

  const Button = ({ content, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.button}
        delayPressIn={0}
        activeOpacity={1}
        onPressIn={() => onPress()}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.tabBar, animatedStyles]}>
      <Button
        content={
          <Icon
            name="mountains"
            style={{ fill: activeTab.name === "feed" ? "#fff" : "transparent" }}
          />
        }
        onPress={() => {
          dispatch(resetScroll(true));

          dispatch(
            switchTab({
              name: "feed"
            })
          );
          resetRoutes()
        }}
      />

      <Button
        content={
          <Icon
            name="x"
            style={{ strokeWidth: activeTab.name === "x" ? "2" : "1" }}
          />
        }
        onPress={() => {
          dispatch(
            switchTab({
              name: "x"
            })
          );
          resetRoutes()
        }}
      />

      <Button
        content={
          <Icon
            name="plus"
            style={{ strokeWidth: activeTab.name === "player" ? "2" : "1" }}
          />
        }
        onPress={() => {
          // dispatch(stopScroll(true));
          dispatch(togglePlayer(true));

          setTimeout(() => {
            // dispatch(stopScroll(true));
            // dispatch(stopScroll(false));
          }, 100);
        }}
      />

      <Button
        content={
          <Icon
            name="search"
            style={{ strokeWidth: activeTab.name === "search" ? "2" : "1" }}
          />
        }
        onPress={() => {
          dispatch(
            switchTab({
              name: "search"
            })
          );

          resetRoutes()
        }}
      />

      <Button
        content={
          <Icon
            name="user"
            style={{
              fill: activeTab.name === "profile" ? "#fff" : "transparent",
            }}
          />
        }
        onPress={() => {
          dispatch(
            switchTab({
              name: "profile"
            })
          );
          resetRoutes()
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 85,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "#000000",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
});

export default AppTabBar;
