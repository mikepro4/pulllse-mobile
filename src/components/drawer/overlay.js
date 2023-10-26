import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

import { toggleDrawer } from "../../redux";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    Easing,
} from "react-native-reanimated";

import CustomText from "../../components/text";
import Button from "../../components/button"

const Overlay = () => {
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

    const animateIn = () => {
        opacity.value = withTiming(1, {
            duration: 1000,
            easing: Theme.easing2,
        })
    };

    useEffect(() => {
        animateIn();
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    const close = useCallback(() => {
        dispatch(
          toggleDrawer({
            drawerOpen: false,
            drawerType: null,
            drawerData: null,
            drawerDraggable: false,
            drawerHeight: null
          })
        );
    })

    return (
        <Animated.View style={[styles.drawerContainer, animatedStyles]}>
            <TouchableOpacity style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10}} onPress={close} />
        </Animated.View>
    );
};

export default Overlay;

const styles = StyleSheet.create({
    drawerContainer: {
        height: 3000,
        paddingHorizontal: 20,
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 10, 
        backgroundColor: "rgba(0,0,0,0.222)", 
    }
})
