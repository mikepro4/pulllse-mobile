import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const [color, setColor] = useState([1.0, 0.0, 0.0, 1.0]); // Initial color: red
  const colorRef = useRef(color); // Create a ref to store the color so it can be accessed in the frameTicker function
  const programRef = useRef(null);
  const glRef = useRef(null);

  const onContextCreate = useCallback(async (gl) => {
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
      uniform vec4 u_color;
      void main() {
        gl_FragColor = vec4(${color});
      }
    `);
    gl.compileShader(fragShader);

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glRef.current = gl;  

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

    // Render
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.flush();
    gl.endFrameEXP();
  }, []);

  useEffect(() => {
    colorRef.current = color; // Update the color ref whenever color changes
  }, [color]);



  const frameTicker = useCallback((time) => {
    const gl = glRef.current;
    const program = programRef.current;

    if (gl && program) {
      gl.useProgram(program);

      // Get the location of the color uniform
      const colorLocation = gl.getUniformLocation(program, 'u_color');
      // Set the value of the color uniform
      gl.uniform4fv(colorLocation, colorRef.current);

      // ... rest of your rendering code

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.flush();
      gl.endFrameEXP();
    }

    requestAnimationFrame(frameTicker);
  }, []);

  const handleToggleAnimation = useCallback(() => {
    requestAnimationFrame(frameTicker);
  }, [frameTicker]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      <Button title="Change Color" onPress={() => setColor([0.0, 1.0, 0.0, 1.0])} />
      <Button title="Start Animation" onPress={handleToggleAnimation} />
    </View>
  );
}

export default App;
