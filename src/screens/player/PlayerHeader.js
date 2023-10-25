import { StyleSheet, View, ScrollView, Button, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { togglePlayer } from "../../redux/slices/tabSlice";

import Icon from "../../components/icon"
import Logo from "../../components/icon/logo"

const PlayerHeader = () => {
    const navigation = useNavigation();
    const [initialAnimation, setInitialAnimation] = useState(true);
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

    const showInitialAnimation = () => {
        opacity.value = withDelay(100, withTiming(1, {
            duration: 1000,
            easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
        }))
    };

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    useEffect(() => {
        showInitialAnimation()
        setInitialAnimation(false)
    }, [])

    return (
        <View style={styles.header}>
            <Animated.View style={[styles.container, animatedStyles]}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPressIn={() => {
                        // alert("lol")
                        dispatch(togglePlayer(false))
                    }}>
                    <View>
                        <Icon name="arrow_back" />
                    </View>
                </TouchableOpacity>

                <View style={styles.headerButtons}>
                    {/* <Pressable
                        activeOpacity={1}
                        delayPressIn={0}
                        onPressIn={() => {
                        }}>
                        <Logo />

                    </Pressable> */}
                </View>


                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPressIn={() => {
                        // alert("lol")
                        dispatch(togglePlayer(false))
                    }}>
                    <View>
                        <Icon name="more" />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default PlayerHeader;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
    },
    headerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        // paddingHorizontal: 20,
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 10,
        flex: 1
    }
});
