import { StyleSheet, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import Theme from "../../styles/theme"

import Icon from "../../components/icon"
import CustomText from "../../components/text"


const Button = ({label, onPressIn, icon, iconRight, status, active}) => {
    const opacity = useSharedValue(0);
    const top = useSharedValue(0);
    const left = useSharedValue(0);
    const bottom = useSharedValue(0);
    const right = useSharedValue(0);

    const animateIn = () => {
        const duration = 200;
        const destination = -10
        const easing = Theme.easing1


        opacity.value = withTiming(1, {
          duration: duration,
          easing: easing,
        });

        top.value = withTiming(destination, {
            duration: duration,
            easing: easing,
        });

        bottom.value = withTiming(destination, {
            duration: duration,
            easing: easing,
        });

        left.value = withTiming(destination, {
            duration: duration,
            easing: easing,

        });

        right.value = withTiming(destination, {
            duration: duration,
            easing: easing,
        });
    };

    const animateOut = () => {
        const duration = 200;
        const easing = Theme.easing3
        
        opacity.value = withTiming(0, {
          duration: duration,
          easing: easing,
        });

        top.value = withTiming(0, {
            duration: duration,
            easing: easing,
        });

        bottom.value = withTiming(0, {
            duration: duration,
            easing: easing,
        });

        left.value = withTiming(0, {
            duration: duration,
            easing: easing,
        });

        right.value = withTiming(0, {
            duration: duration,
            easing: easing,
        });
    };

    useEffect(() => {
        if(active) {
            animateIn();
        } else {
            animateOut();
        }
    }, [active]);

    const backgroundStyles = useAnimatedStyle(() => ({
        opacity: opacity.value,
        top: top.value,
        left: left.value,
        bottom: bottom.value,
        right: right.value,
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

        let iconFill

        if (active == true) {
            iconFill = Theme.green
        } else {
            iconFill = Theme.white
        }
        if(label && icon) {
            return (
                <View style={{paddingRight: 5}}>
                    <Icon name={icon} style={{fill: iconFill}}/>
                </View>
            )
        }
        if(icon) {
            return (
                <Icon name={icon} style={{fill: iconFill}} />
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
        return (
            <Animated.View style={[styles.activeBackground, backgroundStyles]}/>
        )
    }

    let textColor

    if (active == true) {
        textColor = Theme.green
    } else {
        textColor = Theme.white
    }

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            activeOpacity={1}
            onPressIn={() => {
                onPressIn()
            }}>

            <View style={styles.contnetWrapper}>
                {renderIcon()}
                <CustomText style={{fontSize: 14, color: textColor}}>{label}</CustomText>
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
        backgroundColor: Theme.backgroundGreen,
        position: "absolute",
        zIndex: -1,
        borderRadius: 6,
    }
    
    
});
