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



// THIS WOOOOOOOOORKS

function App() {
  const clock = useClockValue();
  const timeValue = useComputedValue(() => (clock.current), [clock]);
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]); // Initial color
  const [animating, setAnimating] = useState(false);
  const shape = useSelector((state) => state.shape);
  const dispatch = useDispatch();

  // Texture buffers
  const [currentIdx, setCurrentIdx] = useState(0);

  const programRef = useRef(null);
  const glRef = useRef(null);
  const colorRef = useRef(color);
  const framebuffers = useRef(null);
  const textures = useRef(null);
  // const currentIdx = useRef(null);

  useEffect(() => {
    colorRef.current = color
  }, [color])

  useEffect(() => {
    // This will be called every time `color` changes.
    if (shape && shape.params) {
      console.log("here")
      colorRef.current = [
        colorRef.current[0],
        shape.params.boldness,
        colorRef.current[2],
        colorRef.current[3],
      ]
    }

  }, [shape]);

  const vertices = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]);

  const onContextCreate = (gl) => {
    glRef.current = gl

    


    //// Error checking
    // const error = gl.getError();
    // if (error !== gl.NO_ERROR) {
    //     console.log('WebGL Error:', error);
    // }

    // const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    // if (status !== gl.FRAMEBUFFER_COMPLETE) {
    //     console.log('Framebuffer is not complete:', status);
    // }

    // const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    // if (gl.drawingBufferWidth > maxTextureSize || gl.drawingBufferHeight > maxTextureSize) {
    //     console.log('Texture size exceeds the maximum size supported by this context.');
    // }

    // if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    //   console.log(gl.getShaderInfoLog(vertShader));
    // }
    // if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    //     console.log(gl.getShaderInfoLog(fragShader));
    // }
    // if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    //     console.log(gl.getProgramInfoLog(program));
    // }

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
        float r = sin(time / 2000.0) * 0.5 + 0.5;
        float g = sin((time + 2000.0) / 2000.0) * 0.5 + 0.5;
        float b = sin((time + 4000.0) / 2000.0) * 0.5 + 0.5;
        // vec4 originalColor = u_color
        gl_FragColor = vec4(r, g, b, 1.0) - prevFrameColor*0.5;  // Mix current frame color with previous frame color
        // gl_FragColor = u_color  u_color / 0.0001;  
      }
    `);
    gl.compileShader(fragShader);
    // const pixels = new Uint8Array(100 * 100);
    // gl.readPixels(0, 0, 100, 100, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    // console.log(pixels);

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program; // Store the program in the re


    // // Framebuffer and Texture Setup

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

    // Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0.0, 0.5,
    ]), gl.STATIC_DRAW);

    


    // Attribute
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Define a render function to update the uniform and render
    const render = (framebuffers, textures) => {
      if (framebuffers && textures) {
        console.log("going here", framebuffers.current, textures.current)
        const gl = glRef.current;
        const program = programRef.current;
        // Bind the current framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.current[currentIdx]);
        gl.useProgram(program);

        // Get the location of the color uniform
        const colorLocation = gl.getUniformLocation(program, 'u_color');
        const timeLocation = gl.getUniformLocation(program, 'time');
        const prevFrameLocation = gl.getUniformLocation(program, 'u_prevFrame');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        // Set uniform color
        gl.uniform4fv(colorLocation, color);
        gl.uniform1f(timeLocation, timeValue.current);
        gl.uniform1i(prevFrameLocation, 1 - currentIdx);  // Use the other texture as previous frame

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.activeTexture(gl.TEXTURE0 + 1 - currentIdx);
        gl.bindTexture(gl.TEXTURE_2D, textures.current[1 - currentIdx]);
        gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // // Swap framebuffers and textures for next frame
        setCurrentIdx(1 - currentIdx);

        // Render
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.flush();
        gl.endFrameEXP();
      }
    };

    // Set up a function to re-render whenever color changes
    render(framebuffers, textures);  // Initial render
  };

  const frameTimer = useRef(0);
  const frameValue = useRef(0);
  const frameHandle = useRef(null);
  const frameTicker = useCallback((time) => {
    const gl = glRef.current;

    const program = programRef.current;
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const prevFrameLocation = gl.getUniformLocation(program, 'u_prevFrame');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set the value of the color uniform
    gl.uniform4fv(colorLocation, colorRef.current);
    gl.uniform1f(timeLocation, timeValue.current);
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // // Activate the texture unit, bind the texture, and set the uniform value
    const textureUnit = 1 - currentIdx;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, textures.current[textureUnit]);
    gl.uniform1i(prevFrameLocation, textureUnit);  // This line sets the uniform value



    // Swap framebuffers and textures for next frame
    setCurrentIdx(textureUnit);
    // console.log("currentIdx.current: ", currentIdx)

    frameValue.current += Math.PI / 600;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    gl.flush();
    gl.endFrameEXP();
    frameTimer.current = time;
    // }
    frameHandle.current = requestAnimationFrame(frameTicker);
  }, []);

  const handleToggleAnimation = useCallback(() => {
    setAnimating(!animating);
    if (!animating) {
      frameHandle.current = requestAnimationFrame(frameTicker);
    } else {
      cancelAnimationFrame(frameHandle.current);
      frameHandle.current = null;
    }
  }, [animating]);

  useEffect(() => {
    setTimeout(() => {
      handleToggleAnimation()
    }, 1)

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      {/* <Button title="Change Color" onPress={() => setColor([0.0, 1.0, 0.0, 1.0])} />  */}
    </View>
  );
}

export default App;
