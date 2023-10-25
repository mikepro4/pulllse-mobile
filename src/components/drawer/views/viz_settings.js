import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../../styles/theme"

import { toggleDrawer } from "../../../redux";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    Easing,
} from "react-native-reanimated";

import CustomText from "../../../components/text";
import Button from "../../../components/button"

const SimpleView = () => {
    return (
        <View>
            <ScrollView style={styles.drawerContainer} >
                <CustomText>Viz settings</CustomText>
            </ScrollView>

        </View>
    );
};

export default SimpleView;

const styles = StyleSheet.create({
    drawerContainer: {
        height: 3000,
        paddingHorizontal: 20
    }
})
