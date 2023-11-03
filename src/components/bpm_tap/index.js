import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme"

import CustomText from '../text';

const BPMTap = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={styles.tapContainer}>
            <View style={styles.tapButtonContainer}>
                <CustomText style={styles.tapText}>TAP</CustomText>
            </View>

            <View style={styles.bpmContainer}>
                <CustomText style={styles.bpmText}>142 bpm</CustomText>
            </View>
        </View>
    );
};

export default BPMTap;


const styles = StyleSheet.create({

    tapContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: 222
    },

    tapButtonContainer: {
        width: 75,
        height: 75,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: Theme.green,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(41, 255, 127, 0.1)",
    },

    bpmContainer: {
        position: "relative",
        marginTop: 20
    },

    bpmText: {
        fontSize: 20,
        fontFamily: "london",
        color: Theme.green,
        position: "relative",
        top: 1,
        // textShadowColor: '#0F0',
        // textShadowOffset: { width: 0, height: 0 },
        // textShadowRadius: 10, 
    },
    tapText: {
        letterSpacing: 2,
        fontSize: 12,
        position: "relative",
        left: 2
    }

});
