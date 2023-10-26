import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { toggleMix } from "../../redux";

import Icon from "../../components/icon"
import Logo from "../../components/icon/logo"
import Button from "../../components/button"
import CustomText from "../../components/text"

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
        <View style={styles.mixerWrapper}>
            <Animated.View style={[styles.container, animatedStyles]}>
                <View style={styles.row}>
                    <View style={styles.gridItem}>
                        <CustomText>LAYER 1</CustomText>
                    </View>

                    <View style={styles.gridItem}>
                        <CustomText>LAYER 2</CustomText>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.gridItem}><CustomText>LAYER 3</CustomText></View>
                    <View style={styles.gridItem}><CustomText>LAYER 4</CustomText></View>
                </View>
            </Animated.View>
        </View>
    );
};

export default PlayerHeader;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 10,
        flex: 1
      },
      gridItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255, 0.05)',
        borderRadius: 10,
        margin: 10,
        padding: 32,
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        // position: "absolute",
        // top: 100,
        left: 0,
        right: 0,
        bottom: 0
    },
    mixerWrapper: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 100,
        paddingTop: 120
    }
});
