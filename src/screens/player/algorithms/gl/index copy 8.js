import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { useDispatch, useSelector } from "react-redux";

import {
  setParams
} from "../../../../redux"

import {
  useClockValue,
  useComputedValue
} from "@shopify/react-native-skia";

function App() {
  const dispatch = useDispatch();
  const clock = useClockValue();
  const timeValue = useComputedValue(() => (clock.current), [clock]);

  const programRef = useRef(null);
  const glRef = useRef(null);
  const frameHandle = useRef(null);

  const framebuffers = useRef(null);
  const textures = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);

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
      uniform float time;
      void main() {
        float r = sin(time) * 0.5 + 0.5;
        float g = sin(time + 2.0) * 0.5 + 0.5;
        float b = sin(time + 4.0) * 0.5 + 0.5;
        gl_FragColor = vec4(r, g, b, 1.0);
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

    /////////////////////////////

    // Binding FrameBuffers

    const fb1 = gl.createFramebuffer();
    const tex1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex1, 0);
    

    const fb2 = gl.createFramebuffer();
    const tex2 = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);

    // Now set them in the state
    framebuffers.current = [fb1, fb2];
    textures.current = [tex1, tex2];

    /////////////////////////////

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

    frameHandle.current = requestAnimationFrame(frameTicker);
  };

  const frameTicker = useCallback((time) => {
    const gl = glRef.current;
    const program = programRef.current;
    gl.useProgram(program);

     // Error checking
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
        console.log('WebGL Error:', error);
    }

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.log('Framebuffer is not complete:', status);
    }

    const timeLocation = gl.getUniformLocation(program, 'time');
    const prevFrameLocation = gl.getUniformLocation(program, 'u_prevFrame');
    gl.uniform1f(timeLocation, timeValue.current/1000); 

    const textureUnit = 1 - currentIdx;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0 + 1 - currentIdx);
    gl.bindTexture(gl.TEXTURE_2D, textures.current[1 - currentIdx]);
    // gl.uniform1i(prevFrameLocation, textureUnit);  // This line sets the uniform value

    // // Swap framebuffers and textures for next frame
    setCurrentIdx(textureUnit);
    console.log(currentIdx)


    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.flush();
    gl.endFrameEXP();

    frameHandle.current = requestAnimationFrame(frameTicker);
  }, []);

  useEffect(() => {
    return () => {
      if (frameHandle.current) {
        cancelAnimationFrame(frameHandle.current);
      }
    };
  }, []);

  useEffect(() => {

    setTimeout(() => {
      dispatch(setParams({
        frequency: 0.3,
        step: 0.3,
        rotation: 0.3,
        boldness: 0.01
      }))
    }, 1)


  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
      <GLView style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}} onContextCreate={onContextCreate} />
    </View>
  );
}

export default App;
