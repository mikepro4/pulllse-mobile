import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

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

const PlayerInfoBar = () => {
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

    const animateIn = () => {
        opacity.value = withDelay(250, withTiming(1, {
            duration: 1000,
            easing: Theme.easing1,
        }))
    };

    useEffect(() => {
        animateIn();
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));
    return (
        <Animated.View style={[styles.infoBarContainer, animatedStyles]}>
            <View style={styles.infoBarLeft}>

                <View style={styles.playArea}>
                    <Button
                        icon="play"
                        onPressIn={() => {
                            alert("play")
                        }} />
                </View>

                <View style={styles.descriptionArea}>
                    <CustomText style={{fontSize: 10, opacity: 0.5, marginBottom: 2, letterSpacing: 0.5 }}>DCDNT</CustomText>
                    <CustomText style={{fontSize: 18}}>Wednesday</CustomText>  
                </View>
            </View>

            <View style={styles.infoBarRight}>
                <Button
                    icon="controls"
                    onPressIn={() => {
                        alert("controls")
                    }} />
            </View>
        </Animated.View>
    );
};

export default PlayerInfoBar;


const styles = StyleSheet.create({
    playArea: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 45,
        marginLeft: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    infoBarLeft: {
        flex: 1,
        // backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
    },
    descriptionArea: {
        paddingLeft: 15
    },
    infoBarRight:  {
        // backgroundColor: "blue",
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    infoBarContainer: {
        position: "absolute",
        flex: 1,
        zIndex: 100,
        //   backgroundColor: "red",
        left: 0,
        bottom: 0,
        right: 0,
        height: 110,
        flexDirection: "row",
    },

});
