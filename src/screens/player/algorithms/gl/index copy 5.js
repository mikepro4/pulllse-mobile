import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const [color, setColor] = useState([1.0, 0.0, 0.0, 1.0]); // Initial color: red
  const [animating, setAnimating] = useState(false);
  const contextRef = useRef(null);
  const colorRef = useRef(color); // Create a ref to store the color so it can be accessed in the frameTicker function
  const programRef = useRef(null);

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
          gl_FragColor = vec4(u_color);
        }
      `);
      gl.compileShader(fragShader);

      // Program
      const program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);
      gl.useProgram(program);
      programRef.current = program; // Store the program in the ref

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

  }, []);

  const frameTimer = useRef(0);
  const frameValue = useRef(0);
  const frameHandle = useRef(null);
  const frameTicker = useCallback((time) => {
    // console.log("here")
    if (contextRef.current) {
      const gl = contextRef.current;

      frameValue.current += Math.PI / 600;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform2fv(rotationRef.current, [Math.cos(frameValue.current), Math.sin(frameValue.current)]);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
      gl.flush();
      gl.endFrameEXP();
      frameTimer.current = time;
    }
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
    colorRef.current = color; // Update the color ref whenever color changes
  }, [color]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
      <Button title="Change Color" onPress={() =>  {
        setColor([0.0, 1.0, 0.0, 1.0])
        handleToggleAnimation()
      }}/> 
    </View>
  );
}

export default App;
