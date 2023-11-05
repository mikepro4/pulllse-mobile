import React, { useEffect, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';



function App() {
  const glRef = useRef(null);
  const positionBufferRef = useRef(null);
  const colorBufferRef = useRef(null);
  const animationFrameId = useRef(null);
  const verticesRef = useRef([]);
  const velocitiesRef = useRef(new Array(2000).fill(0));
  const colorsRef = useRef([]); // Add a ref to store the colors

  const targetsRef = useRef([]);
  const pointsRef = useRef([]);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  rotate = 0;
  this.radius = _rad;
  this.rotate_speed = 0.001 * 0.1 + 0.001;
  this.friction = 0.01 * 0.8 + 0.1;
  this.speed = 0.01 * 0.2 + 0.03;
  this.step = 5 * 0.5 + 0.0001;

  this.freq = 0.0001 * 0.09 + 0.01;
  this.bold_rate = 1 * 0.3 + 0.1;

  const friction = 0.9; // Coefficient of friction

  const onContextCreate = (gl) => {
    glRef.current = gl;

    widthRef.current = gl.drawingBufferWidth;
    heightRef.current = gl.drawingBufferHeight;

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
    const now = Date.now();
  
    if (gl && animationFrameId.current !== null) {
      // Update velocities and positions to create an oscillating effect with friction
      for (let i = 0; i < verticesRef.current.length; i += 2) {
        const xIndex = i;
        const yIndex = i + 1;
  
        // Apply a force based on a sine wave
        const forceX = 0.05 * Math.sin((xIndex + 1) * 0.1 * now);
        const forceY = 0.00005 * Math.sin((yIndex + 1) * 0.1 * now);
  
        // // Update velocities with this force
        // velocitiesRef.current[xIndex] += forceX;
        // velocitiesRef.current[yIndex] += forceY;
  
        // // Apply friction to the velocities
        // velocitiesRef.current[xIndex] *= friction;
        velocitiesRef.current[yIndex] -= forceY;
  
        // // Update positions based on the velocities
        verticesRef.current[xIndex] += velocitiesRef.current[xIndex];
        verticesRef.current[yIndex] += velocitiesRef.current[yIndex];
      }
  
      // Upload updated vertices to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesRef.current), gl.DYNAMIC_DRAW);
  
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, verticesRef.current.length / 2);
  
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
