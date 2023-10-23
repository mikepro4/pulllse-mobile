import { StyleSheet, View, ScrollView, Button, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';

import Icon from "../icon"
import Logo from "../icon/logo"

import { resetScroll } from '../../redux/slices/tabSlice'

const Header = () => {
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
        <Animated.View style={[styles.container, animatedStyles]}>
            <View>
                <Icon name="map" />
            </View>

            <View>
                <Pressable
                    activeOpacity={1}
                    delayPressIn={0}
                    onPressIn={() => {
                        dispatch(
                            resetScroll(true)
                        );
                    }}>
                    <Logo />

                </Pressable>
            </View>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Notifications");
                }}>
                <Icon name="notification" />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flex: 1
    }
});
