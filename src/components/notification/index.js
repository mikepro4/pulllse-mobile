import { StyleSheet, Dimensions, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

import { toggleNotification } from "../../redux";

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

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const Notification = () => {
    const app = useSelector((state) => state.app);
    const opacity = useSharedValue(0);
    const height = useSharedValue(0);
    const dispatch = useDispatch();

    const animateIn = () => {
        opacity.value = withDelay(50, withTiming(1, {
            duration: 200,
            easing: Theme.easing1,
        }))
    };

    const animateOut = () => {
        opacity.value = withTiming(0, {
            duration: 200,
            easing: Theme.easing2,
        })
    };

    const animateInHeight = () => {
        height.value = withDelay(0, withTiming(40, {
            duration: 200,
            easing: Theme.easing1,
        }))
    };

    const animateOutHeight = () => {
        height.value = withTiming(0, {
            duration: 200,
            easing: Theme.easing2,
        })
    };


    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    const animatedBoxStyles = useAnimatedStyle(() => ({
        height: height.value,
        opacity: opacity.value
    }));

    const clearNotification = () => {

        dispatch(
            toggleNotification({
                notificationActive: false,
                notificationMessage: null,
                notificationIntent: null,
            }));
        // animateOut()
        // animateOutHeight()

        // setTimeout(() => {
        //     dispatch(
        //         toggleNotification({
        //             notificationActive: false,
        //             notificationMessage: null,
        //             notificationIntent: null,
        //         }));
        // }, 500);


    }

    useEffect(() => {
        if (app.notificationActive) {
            animateIn()
            animateInHeight()
            setTimeout(() => {
                clearNotification()
            }, 2222);
        } else {
            animateOut()
            animateOutHeight()
        }
    }, [app.notificationActive])

    if (app.notificationActive) {
        return (
            <TouchableOpacity
                onPress={clearNotification}
                activeOpacity={0}
                style={styles.notificationContainer}>
                <Animated.View style={[styles.notificationBox, animatedBoxStyles]}>
                    <Animated.View style={[styles.notificationWrapper, animatedStyles]}>
                        <CustomText style={styles.notificationText}>PULSE DUPLICATED</CustomText>
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        );
    } else {
        return
    }

};

export default Notification;

const styles = StyleSheet.create({
    notificationBox: {
        backgroundColor: "black",
        width: "100%",
        alignItems: "center",
        position: "absolute",
        height: 0,
        justifyContent: "center",
        overflow: "hidden",
        // paddingVertical: 15
    },
    notificationText: {
        fontFamily: "london",
        fontSize: 12,
        color: Theme.green,
        position: "relative",
        top: 1,
        textShadowColor: '#0F0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10, 
    },

    notificationContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 9999,
    },
    notificationWrapper: {
        overflow: "hidden",
        paddingLeft: 2,
        overflow: "hidden",
        // backgroundColor: "blue",
        top: 0,
        right: 0,
        bottom: 0,
    },
})
