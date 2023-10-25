import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';

import Icon from "../../components/icon"
import CustomText from "../../components/text"

const Button = ({label, onPressIn, icon, iconRight}) => {

    let iconOnly
    let labelOnly

    if(!label) {
        iconOnly = true
    }

    if(!icon) {
        labelOnly = true
    }

    const getButtonStyle = () => {
        return (
            iconOnly ? styles.iconOnly : styles.buttonContainer
        )
    }

    const renderIcon = () => {
        if(label && icon) {
            return (
                <View style={{paddingRight: 10}}>
                    <Icon name={icon}/>
                </View>
            )
        }
        if(icon) {
            return (
                <Icon name={icon}/>
            )
        }
    }

    const renderIconRight = () => {
        if(iconRight) {
            return (
                <View style={{paddingLeft: 10}}>
                    <Icon name={iconRight}/>
                </View>
            )
        }
    }

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPressIn={() => {
                onPressIn()
            }}>
            {renderIcon()}
            <CustomText style={{fontSize: 16}}>{label}</CustomText>
            {renderIconRight()}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 15,
        height: 50,
    },
    iconOnly: {
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 50,
        height: 50,
    }
    
});
