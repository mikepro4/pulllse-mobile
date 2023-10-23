import { StyleSheet, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import CustomText from "../../components/text";

import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import Theme from "../../styles/theme"
import NotificationHeader from "../../components/header/notificationHeader";

const Notifications = () => {

    return (
        <View style={{ backgroundColor: "black", flex: 1, paddingTop: 130}}>
            <View style={styles.header}>
                <NotificationHeader/>
            </View>
            <CustomText>Notification</CustomText>
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 20,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    }
});