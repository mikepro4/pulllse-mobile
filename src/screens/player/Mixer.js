import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';

import Theme from "../../styles/theme"
import Icon from "../../components/icon"
import Button from "../../components/button"
import CustomText from "../../components/text"
import Viz from "./Viz"

import { toggleDrawer, setActiveLayer, toggleMix } from "../../redux";


const PlayerHeader = () => {
    const player = useSelector((state) => state.player);
    const navigation = useNavigation();
    const [initialAnimation, setInitialAnimation] = useState(true);
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

    const showInitialAnimation = () => {
        opacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
        })
    };

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    useEffect(() => {
        showInitialAnimation()
        setInitialAnimation(false)
    }, [])

    const renderLayer = (layer) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    // dispatch(
                    //     toggleDrawer({
                    //         drawerOpen: true,
                    //         drawerType: "layer_settings",
                    //         drawerData: {
                    //             layerName: layer.layerName
                    //         },
                    //         drawerDraggable: true,
                    //         drawerHeight: "halfScreen"
                    //     }));
                    dispatch(setActiveLayer(layer.position))
                    // dispatch(toggleMix(false))
                }}
                activeOpacity={1}
                style={[styles.gridItem,layer.position == player.activeLayer ? {borderColor: Theme.green }: {}]}>
                <CustomText style={[styles.layerTitle, layer.position == player.activeLayer ? {
                    color: Theme.green, 
                    opacity: 1,
                    textShadowColor: '#0F0',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 2, 
                }: {}]}>{layer.layerName}</CustomText>
                <Viz preview={true} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.mixerWrapper}>
            <Animated.View style={[styles.container, animatedStyles]}>
                <View style={styles.row}>
                    {renderLayer({ layerName: "LAYER 1", position: 0 })}
                    {renderLayer({ layerName: "LAYER 2", position: 1 })}
                </View>

                <View style={styles.row}>
                    {renderLayer({ layerName: "LAYER 3", position: 2 })}
                    {renderLayer({ layerName: "LAYER 4", position: 3 })}
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
    },
    layerTitle: {
        position: "absolute",
        top: 15,
        left: 15,
        fontSize: 7,
        fontFamily: "london",
        opacity: 0.4
    }
});
