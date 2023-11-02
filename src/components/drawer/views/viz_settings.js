import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../../styles/theme";


import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    Easing,
} from "react-native-reanimated";

import CustomText from "../../../components/text";
import Button from "../../../components/button"

import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';

const SimpleView = () => {
    const dispatch = useDispatch();
    const [code, setCode] = useState()

    return (
        <View style={{ position: "relative", flex: 1}}>
            <ScrollView style={styles.drawerContainer} >
                {/* <CustomText>Viz settings</CustomText> */}
                {/* <CodeEditor
                    style={{
                        fontSize: 12,
                        // inputLineHeight: 26,
                        // highlighterLineHeight: 26,
                        backgroundColor: "transparent",
                        borderRadius: 10,
                        overflow: "hidden",
                        marginBottom: 600
                        
                    }}
                    language="glsl"
                    // syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                    autoFocus={false}
                    showLineNumbers={false}
                    initialValue={shape.viz.main.source}
                    onChange={(code) => {
                        setCode(code)
                    }
                    }
                /> */}
            </ScrollView>

        </View>
    );
    
};

export default SimpleView;

const styles = StyleSheet.create({
    drawerContainer: {
        // flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: "red",
        paddingHorizontal: 20,

    }
})
