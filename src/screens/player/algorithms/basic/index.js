import {
    Canvas,
    Fill,
    Shader,
    Skia,
    useClockValue,
    useComputedValue
} from "@shopify/react-native-skia";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "react-native";


const SHADER_SOURCE = `
uniform float t;
vec4 main(vec2 pos) { 
    float x = sin(t / 1000);
    return vec4(x, x, 1, 1);
}
`

const source = Skia.RuntimeEffect.Make(SHADER_SOURCE);

const Carpet = ({ children, shape }) => {
    const { width, height } = useWindowDimensions();
    const clock = useClockValue();
    const uniforms = useComputedValue(() => ({ t: clock.current }), [clock]);
    return ( <Fill><Shader
        source={source}
        uniforms={uniforms}
    /></Fill>)

};

export default Carpet;
