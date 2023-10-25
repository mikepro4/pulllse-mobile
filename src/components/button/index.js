import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';

import Icon from "../../components/icon"
import CustomText from "../../components/text"


const Button = ({label, onPressIn, icon, iconRight, status, active}) => {
    const opacity = useSharedValue(0);

    const animateIn = () => {
        opacity.value = withTiming(1, {
          duration: 1000,
        });
    };

    const animateOut = () => {
        opacity.value = withTiming(0, {
          duration: 1000,
        });
    };

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
      }));

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
                <View style={{paddingRight: 5}}>
                    <Icon name={icon} style={{fill: "white"}}/>
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

    const renderStatusIcon = () => {
        if(status) {
            return (
                <View style={styles.status}/>
            )
        }
    }

    const renderActiveBackground = () => {
        if(active) {
            return (
                <View style={styles.activeBackground}/>
            )
        }
    }

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPressIn={() => {
                onPressIn()
            }}>

            <View style={styles.contnetWrapper}>
                {renderIcon()}
                <CustomText style={{fontSize: 14}}>{label}</CustomText>
                {renderIconRight()}
                {renderStatusIcon()}
                {renderActiveBackground()}
            </View>
            
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    contnetWrapper: {
        position: "relative", 
        flexDirection: "row"
    },
    buttonContainer: {
        // backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 15,
        height: 50,
        position: "relative",
    },
    iconOnly: {
        // backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 50,
        height: 50,
        position: "relative",
    },
    status: {
        position: "absolute",
        width: 4,
        height: 4,
        right: -5,
        top: -4,
        borderRadius: 10,
        backgroundColor: "#29FF7F"
    },
    activeBackground: {
        top: -10,
        left: -10,
        bottom: -10,
        right: -10,
        backgroundColor: "red",
        position: "absolute",
        zIndex: -1,
        borderRadius: 6,
    }
    
    
});
