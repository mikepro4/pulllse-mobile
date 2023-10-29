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
  const timeValue = useComputedValue(() => (clock.current), [clock]);
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const programRef = useRef(null);
  const glRef = useRef(null);
  const framebuffers = useRef([null, null]);
  const textures = useRef([null, null]);

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
      uniform sampler2D u_prevFrame;
      uniform vec2 resolution;
      void main() {
        vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
        float r = sin(time) * 0.5 + 0.5;
        float g = sin(time + 2.0) * 0.5 + 0.5;
        float b = sin(time + 4.0) * 0.5 + 0.5;
        // gl_FragColor = vec4(r, g, b, 1.0) - prevFrameColor*0.5;
        gl_FragColor = prevFrameColor;
      }
    `);
    gl.compileShader(fragShader);

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
    for (let i = 0; i < 2; i++) {
      const fb = gl.createFramebuffer();
      const tex = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      framebuffers.current[i] = fb;
      textures.current[i] = tex;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    requestAnimationFrame(frameTicker);
  };

  const frameTicker = useCallback((time) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textureUnit = 1 - currentIdx;

    gl.useProgram(program);

    // Get uniform locations
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const prevFrameLocation = gl.getUniformLocation(program, 'u_prevFrame');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set uniform values
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(timeLocation, time / 1000);  // Convert ms to seconds
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Activate the texture unit, bind the texture, and set the uniform value
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, textures.current[textureUnit]);
    gl.uniform1i(prevFrameLocation, textureUnit);

    // Bind the current framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.current[currentIdx]);

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Swap framebuffers and textures for next frame
    setCurrentIdx(textureUnit);

    gl.flush();
    gl.endFrameEXP();

    requestAnimationFrame(frameTicker);
  }, [currentIdx, color]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
    </View>
  );
}

export default App;
