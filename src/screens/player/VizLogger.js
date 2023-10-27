import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';

import Button from "../../components/button"
import CustomText from "../../components/text"
import Viz from "./Viz"

const VizLogger = () => {
    const player = useSelector((state) => state.player);
    const [layer, setLayer] = useState(null);
    const navigation = useNavigation();
    const opacity = useSharedValue(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const activeLayer = player.editedLayers.filter(item => item.position === player.activeLayer);
        setLayer(activeLayer[0])
    }, [])

    const renderParam = (name, value) => {
       return (
            <View style={styles.paramContainer}>
                <View style={styles.paramTitleContainer}>
                    <CustomText style={styles.paramTitle}>{name}</CustomText>
                </View>

                <View style={styles.paramValue}>
                    <CustomText style={styles.paramValue}>{value}</CustomText>
                </View>
            </View>
       )
    }

    if(layer) {
        return (
            <View style={styles.loggerWrapper}>
                <View style={{ marginVertical: 10 }}>
                    {renderParam("Active layer", player.activeLayer)}
                    {renderParam("Algorithm", layer.algorithm)}
                    {renderParam("Position", layer.position)}
                    {renderParam("Frequency", layer.params.frequency)}
                    {renderParam("Step", layer.params.step)}
                    {renderParam("Rotation", layer.params.rotation)}
                    {renderParam("Boldness", layer.params.boldness)}
                </View>
            </View>
        );
    }
    
};

export default VizLogger;

const styles = StyleSheet.create({
    loggerWrapper: {
        position: "absolute",
        zIndex: 1,
        top: 120,
        flex: 1
    },
    paramContainer:{
        flexDirection: "row",
        marginBottom: 2
    },
    paramTitleContainer: {
        width: 66,

    },
    paramTitle: {
        fontSize: 10,
        opacity: 0.5
    },
    paramValue: {
        fontSize: 10,
        opacity: 1
    }
});
