import { StyleSheet, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import Icon from "../../components/icon"
import CustomText from "../../components/text";

import Theme from "../../styles/theme"

const Post = (props) => {
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
        <Animated.View style={[styles.postContainer, animatedStyles]}>
            {/* <CustomText>Post</CustomText> */}
        </Animated.View>
    );
};

export default Post;

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#222222",
        flex: 1,
        height: 480,
        marginBottom: 20,
        marginHorizontal: 10,
        borderRadius: 30
    }
});
