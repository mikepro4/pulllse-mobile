import { StyleSheet, View, ScrollView, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useDispatch, useSelector } from "react-redux";
import Icon from "../../components/icon";
import CustomText from "../../components/text";

import Theme from "../../styles/theme";
import PlayerComponent from "./PlayerComponent";

import { setLayers, setOriginalPulse } from "../../redux";

import PlayerHeader from "./PlayerHeader";
import PlayerInfoBar from "./PlayerInfoBar";
import Viz from "./Viz";
import VizControls from "./VizControls";
import VizLogger from "./VizLogger";

import { clearPlayer, setPulseAudioSourceType } from "../../redux";

const Player = () => {
  const player = useSelector((state) => state.player);
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

    if(!player.editedPulse) {
      dispatch(setPulseAudioSourceType("recording"))
    }

    return () => {
      console.log("Player unmounted");
      dispatch(clearPlayer());
    };
  }, []);


  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const renderMainArea = () => {
    return(<>
      {/* <VizLogger/> */}
      {/* <VizControls/> */}
      <Viz/>
    </>)

  }

  return (
      <Animated.View style={[styles.playerContainer, animatedStyles]}>
        <PlayerHeader/>
        {renderMainArea()}
        <PlayerInfoBar/>
      </Animated.View>
  );
};

export default Player;

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    flex: 1,
    zIndex: 1000,
    backgroundColor: "#000",
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
