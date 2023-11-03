import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';

const RecordingEditor = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={styles.editorContainer}>

            
            {/* <CustomText>Recording Editor</CustomText> */}
        </View>
    );
};

export default RecordingEditor;


const styles = StyleSheet.create({
    editorContainer: {
        // backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "row",
        height: 142,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        borderBottomWidth: 1,
    }
});
