import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { togglePlayer } from "../../redux/slices/tabSlice";

import Icon from "../../components/icon"
import Logo from "../../components/icon/logo"
import Button from "../../components/button"

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
                <Button
                    icon="arrow_back"
                    onPressIn={() => {
                        dispatch(togglePlayer(false))
                    }} />


                <View style={styles.headerButtons}>
                    <Button
                        label="Mix"
                        icon="atom"
                        onPressIn={() => {
                            alert("Mix")
                            // dispatch(togglePlayer(false))
                        }} />
                    <Button
                        label="Duplicate"
                        icon="duplicate"
                        onPressIn={() => {
                            alert("Duplicate")
                            // dispatch(togglePlayer(false))
                        }} />
                    <Button
                        label="Save"
                        icon="save"
                        onPressIn={() => {
                            alert("Save")
                            // dispatch(togglePlayer(false))
                        }} />
                </View>



                <Button
                    icon="more"
                    onPressIn={() => {
                        // dispatch(togglePlayer(false))
                        alert("More")
                    }} />

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
        // paddingHorizontal: 10,
        position: "relative",
        left: 6
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
