import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../../../styles/theme"

import { toggleDrawer } from "../../../redux";

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

    let fragmentShader = `precision highp float;
uniform vec4 u_color;
uniform float time;
uniform float boldness;
uniform sampler2D u_prevFrame;
uniform vec2 resolution;
varying vec2 vUv;


void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    float t = time*0.1;
    float lineWidth = 0.002;
    
    vec3 color = vec3(0.0);
    for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
        color[j] += lineWidth*float(i*i) / sin(t + 0.1*float(j)+float(i)*0.0001)*0.9 - length(uv)*0.2 + mod(fract(uv.x + uv.y), boldness);
        }
    }

    vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
            
    gl_FragColor = vec4(color[0],color[1],color[2],1.0) + vec4(prevFrameColor[0], prevFrameColor[1], prevFrameColor[2], 1.0)*0.6;
}
void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    float t = time*0.1;
    float lineWidth = 0.002;
    
    vec3 color = vec3(0.0);
    for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
        color[j] += lineWidth*float(i*i) / sin(t + 0.1*float(j)+float(i)*0.0001)*0.9 - length(uv)*0.2 + mod(fract(uv.x + uv.y), boldness);
        }
    }

    vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
            
    gl_FragColor = vec4(color[0],color[1],color[2],1.0) + vec4(prevFrameColor[0], prevFrameColor[1], prevFrameColor[2], 1.0)*0.6;
}
void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    float t = time*0.1;
    float lineWidth = 0.002;
    
    vec3 color = vec3(0.0);
    for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
        color[j] += lineWidth*float(i*i) / sin(t + 0.1*float(j)+float(i)*0.0001)*0.9 - length(uv)*0.2 + mod(fract(uv.x + uv.y), boldness);
        }
    }

    vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
            
    gl_FragColor = vec4(color[0],color[1],color[2],1.0) + vec4(prevFrameColor[0], prevFrameColor[1], prevFrameColor[2], 1.0)*0.6;
}
`;

    return (
        <View style={{ position: "relative", flex: 1}}>
            <ScrollView style={styles.drawerContainer} >
                {/* <CustomText>Viz settings</CustomText> */}
                <CodeEditor
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
                    syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                    autoFocus={false}
                    showLineNumbers={false}
                    initialValue={fragmentShader}
                />
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
