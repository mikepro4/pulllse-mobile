import { StyleSheet, View, ScrollView, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

import { useDispatch, useSelector } from "react-redux";
import Icon from "../../components/icon";
import CustomText from "../../components/text";

import Theme from "../../styles/theme";
import PlayerComponent from "./PlayerComponent";

import { togglePlayer } from "../../redux/slices/tabSlice";

import PlayerHeader from "./PlayerHeader";
import PlayerInfoBar from "./PlayerInfoBar";
import Viz from "./Viz";

const Player = () => {
  const dispatch = useDispatch();
  const opacity = useSharedValue(0);

  const animateIn = () => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Theme.easing1,
    });
  };

  useEffect(() => {
    animateIn();
  }, []);

  const renderedHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>  {
            dispatch(togglePlayer(false))
          }}
        >
          <CustomText>Hide</CustomText>
        </TouchableOpacity>
      </View>
    )
  }

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
      <Animated.View style={[styles.playerContainer, animatedStyles]}>
        {/* {renderedHeader()} */}
        <PlayerHeader/>
        <Viz/>
        <PlayerInfoBar/>
        {/* <PlayerComponent /> */}
      </Animated.View>
  );
};

export default Player;

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    flex: 1,
    zIndex: 1,
    backgroundColor: "#222",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
