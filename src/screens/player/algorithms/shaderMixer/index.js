import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Button } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { GLView } from 'expo-gl';

import {
    setParams,
    setShader,
    setSource,
    setUniforms,
    setViz
} from "../../../../redux"


import {
    Canvas,
    Fill,
    Shader,
    Skia,
    useClockValue,
    useComputedValue
} from "@shopify/react-native-skia";

// goddamin it works

let animationFrameId;

// set up buffer and shader
let bufferShaderId;
let mainShaderId;;

let uniformLocations = {};


function App() {
    const clock = useClockValue();
    const dispatch = useDispatch();
    const shape = useSelector((state) => state.shape);
    const viz = useSelector((state) => state.shape.viz);
    const timeValue = useComputedValue(() => (clock.current), [clock]);
    const [contextResetKey, setContextResetKey] = useState(false);
    

    let uniforms = useRef({});


    const frameTicker = useCallback(() => {
        if (animationFrameId) {

        } else {
            cancelAnimationFrame(animationFrameId);
        }

    }, []);

    uniforms.current = {
        ["u_frequency"] : {
            id: 1,
            displayName: "Frequency",
            name: "u_frequency",
            type: "float",
            initialValue: 0.3,
            from: -10.0,
            top: 10.0,
            step: 0.1,
            value: 0.33244
        }
    }

    const generateUniformDefinitions = () => {
        let code = ``
        const uniformKeys = Object.keys(uniforms.current);
        uniformKeys.forEach(key => {
            const uniform = uniforms.current[key];
            // generateUniform(gl, program, uniform);
            code += `uniform ${uniforms.current[key].type} ${key};\n`;

        });

        return code
    }

    const onContextCreate = (gl) => {
    }

    let uniformsCode = `
uniform vec4 u_color;
uniform float time;
uniform float boldness;
uniform sampler2D u_prevFrame;
uniform vec2 resolution;
varying vec2 vUv;
${generateUniformDefinitions()}
`;

    // vertex shader
    let vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    gl_Position = vec4(position, 0, 1);
    vUv = position * .5 + .5;; 
}
`;

    // fragment shader
    let fragmentShader = `
precision highp float;
${uniformsCode}

${viz.main.source}
`;


    useEffect(() => {

        dispatch(setViz({
            id: 1,
            type: "glsl",
            name: "GLSL Shader 1",
            main: {
                source: `void main() {
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
                }`,
                uniforms: {
                    ["u_frequency"] : {
                            id: 1,
                            displayName: "Frequency",
                            name: "u_frequency",
                            type: "float",
                            initialValue: 0.3,
                            from: -10.0,
                            top: 10.0,
                            step: 0.1,
                            value: 0.33244
                        }
                    }
                }
            })
        )
       
        //     dispatch(setSource({
        //         destination: "main",
        //         source: fragmentShader
        //     }))

        //     dispatch(setUniforms({
        //         destination: "main",
        //         uniforms: {
        //             ["u_frequency"] : {
        //                 id: 1,
        //                 displayName: "Frequency",
        //                 name: "u_frequency",
        //                 type: "float",
        //                 initialValue: 0.3,
        //                 from: -10.0,
        //                 top: 10.0,
        //                 step: 0.1,
        //                 value: 0.33244
        //             }
        //         }
        //     }))
        // }, 1)

        return () => {
            // Your cleanup code here
            // console.log('Component will unmount');
            // cancelAnimationFrame(animationFrameId);
            // animationFrameId = null
            // frameHandle.current = null;
        };

    }, [])

    useEffect(() => {
        generateUniformDefinitions(uniforms)
        animationFrameId = requestAnimationFrame(frameTicker)
        

        setTimeout(() => {

            dispatch(setShader(viz.main.source))

        }, 1)

        return () => {
            // Your cleanup code here
            console.log('Component will unmount');
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null
            // frameHandle.current = null;
        };

    }, [shape?.viz?.main?.source])

    // useEffect(() => {
    //     if (boldness && shape && shape.params && shape.params.boldness) {
    //         boldness.current = shape.params.boldness
    //     }

    // }, [shape.params])


    return (
        <View key={contextResetKey} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* <GLView style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}} onContextCreate={onContextCreate} /> */}
            
            <GLView
                
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                onContextCreate={onContextCreate}
            />
            {/* <GLView
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                onContextCreate={onContextCreateBuffer}
            /> */}
        </View>
    );
}

export default App;
