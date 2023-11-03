import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../styles/theme";

import CustomText from '../text';
import Icon from "../icon";

const RecordingEditor = () => {
    const player = useSelector((state) => state.player);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <>
            <View style={styles.editorContainer}>

                <View style={[styles.urlContainer, isFocused && styles.activeBorder]}>
                    <CustomText style={styles.trackUrl}>TRACK URL:</CustomText>
                    <TextInput
                        style={styles.trackUrlInput}
                        placeholder="Paste track URL here...."
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    ></TextInput>
                </View>
                <View style={styles.trackPreviewContainer}>
                    <View style={styles.trackPreviewLeft}>
                        <Icon style={{opacity: 0.5}} name="x"/>
                    </View>
                    <View style={styles.trackPreviewRight}>
                        <View style={styles.trackTitle}></View>
                        <View style={styles.artistName}></View>
                    </View>
                </View>

                {/* <CustomText>Recording Editor</CustomText> */}
            </View>



        </>
    );
};

export default RecordingEditor;


const styles = StyleSheet.create({
    trackPreviewContainer: {
        height: 40,
        flexDirection: "row",
    },
    trackTitle: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: 150,
        height: 20,
        borderRadius: 3,
        marginBottom: 10
    },
    artistName: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: 100,
        height: 10,
        borderRadius: 3,
    },
    trackPreviewLeft: {
        width: 60,
        height: 60,
        marginRight: 10,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
    },

    trackPreviewRight: {
        flex: 1,
        height: 60,
        // backgroundColor: "red"
        justifyContent: "center",
    },
    trackUrlInput: {
        position: "absolute",
        top: 0,
        left: 72,
        right: 0,
        bottom: 0,
        color: "white",
        fontFamily: "aeonik-regular"
        // backgroundColor: "rgba(255, 255, 255, 0.05)",

    },
    trackUrl: {
        fontFamily: "london",
        fontSize: 7,
        color: Theme.green,
        position: "absolute",
        top: 15,
        left: 13,
        textShadowColor: '#0F0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    urlContainer: {
        backgroundColor: "rgba(41, 255, 127, 0.05)",
        height: 40,
        // flex: 1,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(41, 255, 127, 0.2)",
        position: "relative",
        marginBottom: 20,
        flexDirection: "row"
    },
    activeBorder: {
        borderColor: "rgba(41, 255, 127, 1.0)",
    },
    editorContainer: {
        // backgroundColor: "rgba(255, 255, 255, 0.05)",
        // alignItems: "center",
        position: "relative",
        // flexDirection: "row",
        height: 142,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        borderBottomWidth: 1,
    }
});
