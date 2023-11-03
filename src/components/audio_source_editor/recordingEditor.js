import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';

const RecordingEditor = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={styles.editorContainer}>

            <View style={styles.editorLeft}>
                <View style={styles.recordButtonContainer}>
                    <View style={styles.recordButton}></View>
                </View>
            </View>
            <View style={styles.editorRight}>
                <View style={styles.emptyRecordingContainer}>
                    <CustomText style={styles.emptyAudioText}>Record audio...</CustomText>
                </View>
            </View>
            {/* <CustomText>Recording Editor</CustomText> */}
        </View>
    );
};

export default RecordingEditor;


const styles = StyleSheet.create({
    editorLeft: {
        width: 50,
        height: 70,
        // backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20
    },
    editorRight: {
        flex: 1,
        // backgroundColor: "red",
        height: 70,
        position: "relative",
        justifyContent: "center",
        // alignItems: "center",
    },

    recordButtonContainer: {
        width: 50,
        height: 50,
        // backgroundColor: "white",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },

    recordButton: {
        width: 40,
        height: 40,
        backgroundColor: "white",
        borderRadius: 50,
        // borderWidth: 1,
        // borderColor: "white",
    },
    editorContainer: {
        // backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "row",
        height: 142,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        borderBottomWidth: 1,
    },
    emptyRecordingContainer: {
        // flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    emptyAudioText: {
        color: "white",
        fontSize: 14,
        opacity: 0.3,
        position: "relative",
        top: -2
    }
});
