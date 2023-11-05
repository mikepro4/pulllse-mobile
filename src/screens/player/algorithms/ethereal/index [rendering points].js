import React, { useEffect, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';

function App() {
  const glRef = useRef(null);
  const bufferRef = useRef(null);
  const animationFrameId = useRef(null);
  const verticesRef = useRef([]);

  const onContextCreate = (gl) => {
    glRef.current = gl;

    // Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, `
      attribute vec2 position;
      attribute vec4 color;
      varying vec4 vColor;
      void main() {
          gl_PointSize = 3.0;
          gl_Position = vec4(position, 0, 1);
          vColor = color;
      }
        `);
    gl.compileShader(vertShader);

    // Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, `
            void main(void) {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
            }
        `);
    gl.compileShader(fragShader);

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Generate random vertices
    for (let i = 0; i < 1000; i++) {
      verticesRef.current.push(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
    console.log(verticesRef.current)


    // Create buffer
    bufferRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesRef.current), gl.DYNAMIC_DRAW);

    // Attribute
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    frameTicker();
  };

  const frameTicker = useCallback(() => {
    const gl = glRef.current;

    if (gl && animationFrameId.current !== null) {
      // Update vertices: move each point slightly to the right
      for (let i = 0; i < verticesRef.current.length; i++) {
        verticesRef.current[i] += 0.0001;
      }

      // Upload updated vertices to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
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
