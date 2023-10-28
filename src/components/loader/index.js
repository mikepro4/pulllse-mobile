import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

import { Animated, Easing } from 'react-native';

import Icon from "../../components/icon"


const SimpleView = () => {
    const spinValue = new Animated.Value(0);

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 699,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();



    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="loader" />
        </Animated.View>
    );
};

export default SimpleView;

const styles = StyleSheet.create({
})
