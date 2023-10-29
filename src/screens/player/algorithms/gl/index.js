import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Button } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]); // Initial color
  const [animating, setAnimating] = useState(false);
  const contextRef = useRef(null);
  const textureRef = useRef(null);
  const rotationRef = useRef(null);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const colorRef = useRef(color); 

  useEffect(() => {
    colorRef.current = color
  }, [color])

  const vertices = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
  ]);


  const onContextCreate = (gl) => {
    glRef.current = gl

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
      void main() {
        gl_FragColor = u_color;
      }
    `);
    gl.compileShader(fragShader);

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program; // Store the program in the re

    // Get uniform location
    const colorLocation = gl.getUniformLocation(program, 'u_color');

    // Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
       0.0,  0.5,
    ]), gl.STATIC_DRAW);

    // Attribute
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Define a render function to update the uniform and render
    const render = () => {

      gl.useProgram(program);

      // Get the location of the color uniform
      const colorLocation = gl.getUniformLocation(program, 'u_color');
      // Set uniform color
      gl.uniform4fv(colorLocation, color);

      // Render
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.flush();
      gl.endFrameEXP();
    };

    // Set up a function to re-render whenever color changes
    render();  // Initial render
  };

  const frameTimer = useRef(0);
  const frameValue = useRef(0);
  const frameHandle = useRef(null);
  const frameTicker = useCallback((time) => {
    // console.log("here")
    // if (contextRef.current) {
      const gl = glRef.current;

      const program = programRef.current;
      const colorLocation = gl.getUniformLocation(program, 'u_color');
      // Set the value of the color uniform
      gl.uniform4fv(colorLocation, colorRef.current);
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
    handleToggleAnimation()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      <Button title="Change Color" onPress={() => setColor([0.0, 1.0, 0.0, 1.0])} /> 
    </View>
  );
}

export default App;
