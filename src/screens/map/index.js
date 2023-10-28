import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
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

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import customMapStyle from "../../components/map/mapStyle";

import CustomText from "../../components/text";
import Button from "../../components/button"

const MapContainer = () => {

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                customMapStyle={customMapStyle}
                region={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
            </MapView>

        </View>
    );
};

export default MapContainer;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#222",
        height: "100%",
        // ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
      },
})
