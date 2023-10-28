import {
    Canvas,
    Fill,
    Shader,
    RuntimeShader,
    Skia,
    useClockValue,
    useComputedValue,
} from "@shopify/react-native-skia";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "react-native";


const SHADER_SOURCE = `

uniform float iResolution_x;
uniform float iResolution_y;
uniform float time;
uniform vec2 resolution;

vec4 main(vec2 pos) { 
    float x = sin(time / 1000);
    return vec4(x, x, 1, 1);
}
`

const source = Skia.RuntimeEffect.Make(SHADER_SOURCE);

const Carpet = ({ children, shape }) => {
    const { width, height } = useWindowDimensions();
    const clock = useClockValue();
    const uniforms = useComputedValue(() => ({
        time: clock.current,
        iResolution_x: width,
        iResolution_y: height,
        resolution: [width, height],
        len: 100.0,  
    }), [clock, width, height]);
    
    return ( <Fill><Shader
        source={source}
        uniforms={uniforms}
    /></Fill>)

};

export default Carpet;
