import { StyleSheet, View, ScrollView, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import { togglePlayer } from '../../redux/slices/tabSlice'

import Icon from "../../components/icon"
import CustomText from "../../components/text";

import Theme from "../../styles/theme"

const Post = (props) => {
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

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
        
        <Animated.View style={[styles.postContainer, animatedStyles]}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.mainClickableArea}
                onPress={() => dispatch(togglePlayer(true))}
            ></TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.playerTouchableArea}
                onPress={() => dispatch(togglePlayer(true))}
            ></TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.infoTouchableArea}
                onPress={() => dispatch(togglePlayer(true))}
            ></TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.arrowTouchableArea}
                onPress={() => dispatch(togglePlayer(true))}
            >
                <Icon name="arrow_forward"/>
            </TouchableOpacity>
            
        </Animated.View>
    );
};

export default Post;

const styles = StyleSheet.create({
    mainClickableArea: {
        // backgroundColor: "red",
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 80,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    playerTouchableArea: {
        backgroundColor: "white",
        width: 45,
        height: 45,
        position: "absolute",
        left: 15,
        bottom: 15,
        borderRadius: 30,
    },
    arrowTouchableArea: {
        width: 45,
        height: 45,
        position: "absolute",
        right: 10,
        bottom: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoTouchableArea: {
        backgroundColor: "white",
        height: 45,
        position: "absolute",
        left: 70,
        right: 60,
        bottom: 15,
        opacity: 0.1
    },
    postContainer: {
        backgroundColor: "#222222",
        flex: 1,
        height: 480,
        marginBottom: 20,
        marginHorizontal: 10,
        borderRadius: 30,
        position: "relative"
    }
});
