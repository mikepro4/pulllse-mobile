import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { GLView } from 'expo-gl';
import { useDispatch, useSelector } from "react-redux";

import {
  setParams
} from "../../../../redux"


function App() {
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]); // Initial color: red
  const shape = useSelector((state) => state.shape);
  const [boldness, setBoldness] = useState(0);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // This will be called every time `color` changes.
  //   if(shape && shape.params) {
  //     console.log("here")
  //     setColor([
  //       color[0],
  //       color[1] + 0.1,
  //       color[2],
  //       color[3],
  //   ])
  //   }

  // }, [shape]);



  const onContextCreate = (gl) => {
    const render = () => {
      // Vertex Shader

      // Get uniform location
      const colorLocation = gl.getUniformLocation(program, 'u_color');

      // Set uniform color
      gl.uniform4fv(colorLocation, color);

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
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.flush();
      gl.endFrameEXP();
    };

    render();
  };

  useEffect(() => {
    // This will be called every time `color` changes.
  }, [color]);

  useEffect(() => {

    setTimeout(() => {
        dispatch(setParams({
            frequency: 0.3,
            step: 0.3,
            rotation: 0.3,
            boldness: 0.001
          }))
    },1)
    

}, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      <Button title="Change Color" onPress={() => setColor([0.0, 1.0, 0.0, 1.0])} /> 
    </View>
  );
}

export default App;
