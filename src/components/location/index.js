import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';

import Icon from "../icon"
import Theme from "../../styles/theme"

const RecordingEditor = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={styles.locationContainer}>

            <Icon name="map" style={{stroke: Theme.purple}}/>
            <CustomText style={{paddingLeft: 10, fontSize: 13}}>East Village, New York City</CustomText>
        </View>
    );
};

export default RecordingEditor;


const styles = StyleSheet.create({
    locationContainer: {
        alignItems: "center", 
        // backgroundColor: "rgba(255, 255, 255, 0.05)",
        position: "relative",
        flexDirection: "row",
    }
});
