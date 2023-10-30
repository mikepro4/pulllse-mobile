import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Button } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { GLView } from 'expo-gl';

import {
  setParams
} from "../../../../redux"


import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClockValue,
  useComputedValue
} from "@shopify/react-native-skia";

function App() {
  const clock = useClockValue();
  const dispatch = useDispatch();
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]);
  const shape = useSelector((state) => state.shape);
  const timeValue = useComputedValue(() => (clock.current), [clock]);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const framebuffers = useRef([null, null]);
  const framebuffer = useRef(null);
  const texture = useRef(null);
  const textures = useRef([null, null]);
  const currentIdx = useRef(0)
  const boldness = useRef(0)

  const onContextCreate = (gl) => {
    glRef.current = gl;

    // Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `);
    gl.compileShader(vertShader);

    // Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, `
      precision highp float;
      uniform vec4 u_color;
      uniform float time;
      uniform float boldness;
      uniform sampler2D u_prevFrame;
      uniform vec2 resolution;

      #define TWO_PI 6.2831853072
    	#define PI 3.14159265359

    	precision highp float;

    	void main(void) {
    	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    	float t = time*0.05;
        float lineWidth = boldness + 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            
            
          }

      }

      vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
			
      gl_FragColor = vec4(color[0],color[1],color[2],1.0) - prevFrameColor * 0.9;
      // gl_FragColor = prevFrameColor;
  }

    `);
    gl.compileShader(fragShader);
    var compileError = gl.getShaderInfoLog(fragShader);
    if (compileError) {
        console.error(compileError);
    }

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
    ]), gl.STATIC_DRAW);

    // Attribute
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Framebuffer and Texture Setup
    const fb = gl.createFramebuffer();
    const tex = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  
    framebuffer.current = fb;
    texture.current = tex;
  
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Framebuffer is not complete:', gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }
  

    frameTicker()
  };

  const frameTicker = useCallback((time) => {

    const gl = glRef.current;
    const program = programRef.current;


    gl.useProgram(program);

    // Get uniform locations
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const boldnessLocation = gl.getUniformLocation(program, 'boldness');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set uniform values
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(timeLocation, timeValue.current / 1000);  // Convert ms to seconds
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
    if(boldness && boldness.current) {
      gl.uniform1f(boldnessLocation, boldness.current);
    }

    gl.activeTexture(gl.TEXTURE0);
   
    // Render to default framebuffer (null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    //  // Now copy the rendered data to your texture for use in the next frame
    gl.uniform1i(gl.getUniformLocation(program, 'u_prevFrame'), 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.current);

    gl.bindTexture(gl.TEXTURE_2D, texture.current);
    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // gl.clearColor(1.0, 1.0, 0.0, 0.0);  // clear to yellow
    // gl.clear(gl.COLOR_BUFFER_BIT);

   
    gl.flush();
    gl.endFrameEXP();

    requestAnimationFrame(frameTicker);
  }, [color]);

  useEffect(() => {

    setTimeout(() => {
      dispatch(setParams({
        frequency: 0.3,
        step: 0.3,
        rotation: 0.3,
        boldness: 0.001
      }))
    }, 1)

  }, [])

  useEffect(() => {
    if(boldness && shape && shape.params && shape.params.boldness) {
      boldness.current = shape.params.boldness
    }

  }, [shape])



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
      <GLView style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}} onContextCreate={onContextCreate} />
    </View>
  );
}

export default App;
