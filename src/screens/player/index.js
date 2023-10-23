import { StyleSheet, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";

import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import { useDispatch, useSelector } from "react-redux";
import Icon from "../../components/icon"
import CustomText from "../../components/text";

import Theme from "../../styles/theme"

const Player = () => {
    const opacity = useSharedValue(0);

    const animateIn = () => {
        opacity.value = withTiming(1, {
            duration: 250,
            easing: Theme.easing1,
        })
    };

    useEffect(() => {
        animateIn();
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View style={[styles.playerContainer, animatedStyles]}>
            {/* <CustomText>Player Render</CustomText> */}
        </Animated.View>
    );
};

export default Player;

const styles = StyleSheet.create({
    playerContainer: {
        position: "absolute",
        flex: 1,
        zIndex: 2,
        backgroundColor: "#000000",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});
