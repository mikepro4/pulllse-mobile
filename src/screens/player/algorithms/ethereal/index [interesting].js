import React, { useEffect, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const glRef = useRef(null);
  const positionBufferRef = useRef(null);
  const colorBufferRef = useRef(null);
  const animationFrameId = useRef(null);
  const verticesRef = useRef([]);
  const colorsRef = useRef([]); // Add a ref to store the colors

  const onContextCreate = (gl) => {
    glRef.current = gl;

    // Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, `
      attribute vec2 position;
      attribute vec4 color; // New attribute for color
      varying vec4 vColor; // Pass color to fragment shader
      void main() {
          gl_PointSize = 3.0;
          gl_Position = vec4(position, 0, 1);
          vColor = color; // Pass the color to the varying
      }
    `);
    gl.compileShader(vertShader);

    // Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, `
      precision mediump float;
      varying vec4 vColor; // Use the passed varying color
      void main(void) {
          gl_FragColor = vColor; // Set the color
      }
    `);
    gl.compileShader(fragShader);

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Generate random vertices and colors
    for (let i = 0; i < 1000; i++) {
      // Random positions
      verticesRef.current.push(Math.random() * 2 - 1, Math.random() * 2 - 1);
      // Random colors
      colorsRef.current.push(Math.random(), Math.random(), Math.random(), 1.0);
    }

    // Create position buffer
    positionBufferRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesRef.current), gl.DYNAMIC_DRAW);

    // Create color buffer
    colorBufferRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsRef.current), gl.DYNAMIC_DRAW);

    // Position attribute
    const positionAttribLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    // Color attribute
    const colorAttribLocation = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferRef.current);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);

    frameTicker();
  };

  const frameTicker = useCallback(() => {
    const gl = glRef.current;
    const now = Date.now(); // Get the current time in milliseconds
  
    if (gl && animationFrameId.current !== null) {
      // Update vertices based on time and a math formula
      for (let i = 0; i < verticesRef.current.length; i += 2) {
        const xIndex = i;
        const yIndex = i + 1;
        
        // Apply a mathematical transformation
        // Example: simple oscillation on x-axis based on time
        const timeFactor = Math.sin(now / 1000); // Oscillate based on the second
        

        const amplitudeX = 0.5; // Amplitude of oscillation on the x-axis
        const amplitudeY = 0.25; // Amplitude of oscillation on the y-axis
        const frequency = 2 * Math.PI / 2000; // Complete oscillation every 1000 milliseconds

        verticesRef.current[xIndex] = amplitudeX * Math.sin(frequency * now + verticesRef.current[xIndex]);
        verticesRef.current[yIndex] = amplitudeY * Math.cos(frequency * now + verticesRef.current[yIndex]);
      }
  
      // Upload updated vertices to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesRef.current), gl.DYNAMIC_DRAW);
  
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1000);
  
      gl.flush();
      gl.endFrameEXP();
  
      animationFrameId.current = requestAnimationFrame(frameTicker);
    }
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(frameTicker);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [frameTicker]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <GLView style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} onContextCreate={onContextCreate} />
    </View>
  );
}

export default App;
