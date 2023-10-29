import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]); // Initial color

  useEffect(() => {
    // This will be called every time `color` changes.
  }, [color]);

  const onContextCreate = (gl) => {
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
      // Set uniform color
      gl.uniform4fv(colorLocation, color);

      // Render
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.flush();
      gl.endFrameEXP();
    };

    // Set up a function to re-render whenever color changes
    useEffect(() => {
      render()
    }, [color])
    render();  // Initial render
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      <Button title="Change Color" onPress={() => setColor([0.0, 1.0, 0.0, 1.0])} /> 
    </View>
  );
}

export default App;
