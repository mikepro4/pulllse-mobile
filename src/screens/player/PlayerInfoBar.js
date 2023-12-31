import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

import { toggleDrawer } from "../../redux";

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

import PlayerComponent from "./PlayerComponent";

const PlayerInfoBar = () => {
    const player = useSelector((state) => state.player);
    const user = useSelector((state) => state.user);
    const opacity = useSharedValue(0);
    const offset = useSharedValue(0);
    const dispatch = useDispatch();

    const animateIn = () => {
        opacity.value = withDelay(250, withTiming(1, {
            duration: 1000,
            easing: Theme.easing1,
        }))

        offset.value = withDelay(250,withSpring(0, {
            mass: 1,
            damping: 57,
            stiffness: 450,
            easing: Easing.inOut(Easing.ease),
        }))
    };

    const animateOut= () => {
        opacity.value = withTiming(0, {
            duration: 1000,
            easing: Theme.easing1,
        })

        offset.value = withSpring(85, {
            mass: 1,
            damping: 57,
            stiffness: 450,
            easing: Easing.inOut(Easing.ease),
        });
    };

    useEffect(() => {
        if(!player.mixEnabled) {
            animateIn();
        } else {
            // animateOut();
        }
    }, [player.mixEnabled]);


    useEffect(() => {
        animateIn();
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: offset.value }],
    }));

    const getUsername = () => {
        if(player.originalPulse) {
            return player.originalPulse.pulse.user.userName
        } else {
            return user.userInfo.userName
        }

    }

    const getPulseTitle = () => {
        if(player.editedPulse && player.editedPulse.title) {
            if(!player.editedPulse.title || player.editedPulse.title.length == 0 ) {
                return <CustomText style={{fontSize: 18, fontFamily: "aeonik-light", letterSpacing: 0.1, opacity: 0.222}}>Untitled...</CustomText>
            } else {
                return <CustomText style={{fontSize: 18, fontFamily: "aeonik-", letterSpacing: 0.1 }}>{player.editedPulse.title}</CustomText>
            }
        } else {
            if(player.originalPulse) {
                return <CustomText style={{fontSize: 18, fontFamily: "aeonik-medium", letterSpacing: 0.1}}>{player.originalPulse.pulse.name}</CustomText>
            } else {
                return <CustomText style={{fontSize: 18, fontFamily: "aeonik-light", letterSpacing: 0.1, opacity: 0.222}}>Untitled...</CustomText>
            }
        }
    }

    const getIcon = () => {
        if(!player.originalPulse  && !player.editedPulse) {
            return "mic"
        }
        if(player.originalPulse) {
            return "play"
        }
        switch(player.editedPulse?.audioSourceType) {
            case "recording":
                return "mic"
            case "spotify":
                return "spotify"
            case "file":
                return "music"
        }
    }

    return (
        <Animated.View style={[styles.infoBarContainer, animatedStyles]}>
            <View style={styles.infoBarLeft}>

                <View style={styles.playArea}>
                    <Button
                        icon={getIcon()}
                        iconColor="#000"
                        onPressIn={() => {
                            // alert("play")
                        }} />
                </View>

                <TouchableOpacity 
                    style={styles.descriptionArea}
                    onPressIn={() => {
                        dispatch(
                            toggleDrawer({ 
                                drawerOpen: true, 
                                drawerType: "pulse_settings", 
                                drawerData: null, 
                                drawerDraggable: true,
                                drawerHeight: "expanded"
                            }));

                    }}
                >
                    <CustomText style={{fontSize: 11, opacity: 0.5, marginBottom: 2, letterSpacing: 0.34, fontFamily: "aeonik-light" }}>{getUsername()}</CustomText>
                    {getPulseTitle()}
                </TouchableOpacity>

                {/* <PlayerComponent /> */}
            </View>

            <View style={styles.infoBarRight}>
                <Button
                    icon="controls"
                    onPressIn={() => {
                        dispatch(
                            toggleDrawer({ 
                                drawerOpen: true, 
                                drawerType: "viz_settings", 
                                drawerData: null, 
                                drawerDraggable: true,
                                drawerHeight: "halfScreen"
                            }));

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
        paddingLeft: 12
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

