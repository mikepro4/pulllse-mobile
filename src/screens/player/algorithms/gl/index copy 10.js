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

function App() {
  const clock = useClockValue();
  const dispatch = useDispatch();
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]);
  const timeValue = useComputedValue(() => (clock.current), [clock]);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const framebuffers = useRef([null, null]);
  const textures = useRef([null, null]);
  const currentIdx = useRef(0)

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
      uniform vec4 u_color;
      uniform float time;
      uniform sampler2D u_prevFrame;
      uniform vec2 resolution;

      // odd number
      const int totalCategories = 111;

      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float rand1(float n){return fract(sin(n) * 43758.5453123);}

      vec3 getCellInfo(vec2 cellIndex) {
          float x = rand(cellIndex);
          float y = rand1(x);
          float v = rand1(y);
          
          return vec3(x, y, v);
      }

      float voronoiDistance(vec2 a, vec2 b) {
          return abs(a.x - b.x) + abs(a.y - b.y);
      }

      vec2 voronoi(vec2 uv) {
          vec2 pos = uv;
          vec2 innerPos = mod(pos, 1.0);
          vec2 index = floor(pos);
      
          float minDistance = 3.0;
          float minValue = -1.0;
          for (float x = -1.0; x <= 1.0; x += 1.0) {
              for (float y = -1.0; y <= 1.0; y += 1.0) {
                  vec2 offset = vec2(x, y);
                  vec3 cellInfo = getCellInfo(index + offset);
                  vec2 cellPos = cellInfo.xy;
                  float cellValue = cellInfo.z;
                  float cellDistance = voronoiDistance(innerPos, cellPos + offset);
                  if (cellDistance < minDistance) {
                      minDistance = cellDistance;
                      minValue = cellValue;
                  }
              }
          }
          return vec2(minDistance, minValue);
      }

      // INTEGER MODULO

      int pmod(int x, int m) {
        return x - ((x / m) * m);
      }

      int umod(int x, int m) {
        int positive = pmod(x, m);
        int negative = m - pmod((-x), m);
        return x >= 0 ? positive : negative;
      }

      ivec2 umod2(ivec2 v, ivec2 m) {
        return ivec2(umod(v.x, m.x), umod(v.y, m.y));
      }

      //////////////////////

      // CELLS
      const int cellTimeStep = 1;
      const int lossThreshold = -2;

      int getCellSize() {
          return int(1);
      }

      int sampleValue(ivec2 coord) {
        vec2 texCoord = vec2(coord) / resolution;
        return int(texture2D(u_prevFrame, texCoord).r);
      }

      int battle(int self, int other) {
        const int center = (totalCategories - 1) / 2;
        int difference = self - center;
        int newOther = umod(other - difference, totalCategories);
        return int(sign(float(center - newOther)));
      }

      int battleWithNeighbor(int value, ivec2 coord) {
        return battle(value, sampleValue(coord));
      }

      int initialValue(ivec2 coord) {
        vec2 center = resolution.xy / float(getCellSize()) / 2.0;
        int dist = int(distance(vec2(coord), center));
        return umod(dist, totalCategories); 
      }

      float mirroredSmooth(float x, float c, float w) {
        return clamp(smoothstep(1.0, 0.0, abs(x - c) / w), 0.0, 1.0);
      }

      vec3 colorFromValue(int value) {
        float factor = float(value) / float(totalCategories);
        const float center = 0.5;
        const float spread = 0.1;
        const float width = 0.4;
        return vec3(
            mirroredSmooth(factor, center - spread, width),
            mirroredSmooth(factor, center, width),
            mirroredSmooth(factor, center + spread, width)
        );
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        ivec2 coord = ivec2(fragCoord) / getCellSize();
    
        if (umod(100, cellTimeStep) != 0) {
          fragColor = texture2D(u_prevFrame, vec2(ivec2(fragCoord)));
          return;
        }

        int last = sampleValue(ivec2(fragCoord));
        int score = 0;
        for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
                if (x != 0 || y != 0) {
                    score += battleWithNeighbor(last, umod2(coord * getCellSize() + getCellSize() * ivec2(x, y), ivec2(resolution))); 
                }
            }
        }
    
        int new = last;
        if (score <= lossThreshold) {
            new = umod(new - 1, totalCategories);
        }
    
        fragColor = vec4(float(new), 0.0, 0.0, 1.0);
    }

  

    //   void main() {
    //     vec4 fragColor;
    //     mainImage(fragColor, gl_FragCoord.xy);
    //     gl_FragColor = fragColor;
    // }

      void main() {
      ivec2 coord = ivec2(gl_FragCoord.xy) / getCellSize();
      int value = initialValue(coord);
      vec3 color = colorFromValue(value);

      float r = sin(time) * 0.5 + 0.5;
      float g = sin(time + 2.0) * 0.5 + 0.5;
      float b = sin(time + 4.0) * 0.5 + 0.5;
      gl_FragColor = vec4(r, g, b, 1.0) + vec4(color, 1.0);
      // gl_FragColor = vec4(color, 1.0);  // Set alpha to 1.0 for full opacity
  }



      // void main() {
      //   vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/vec2(300.0,300.0));
      //   float r = sin(time) * 0.5 + 0.5;
      //   float g = sin(time + 2.0) * 0.5 + 0.5;
      //   float b = sin(time + 4.0) * 0.5 + 0.5;
      //   gl_FragColor = vec4(r, g, b, 1.0) - prevFrameColor*0.9;
      // }

    `);
    gl.compileShader(fragShader);
    var compileError = gl.getShaderInfoLog(fragShader);
    if (compileError) {
        console.error(compileError);
    }

    // Program
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

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

    // Framebuffer and Texture Setup
    for (let i = 0; i < 2; i++) {
      const fb = gl.createFramebuffer();
      const tex = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      framebuffers.current[i] = fb;
      textures.current[i] = tex;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    frameTicker()
  };

  const frameTicker = useCallback((time) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textureUnit = 1 - currentIdx.current;

    gl.useProgram(program);

    // Get uniform locations
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const prevFrameLocation = gl.getUniformLocation(program, 'u_prevFrame');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set uniform values
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(timeLocation, timeValue.current / 1000);  // Convert ms to seconds
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Activate the texture unit, bind the texture, and set the uniform value
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, textures.current[textureUnit]);
    gl.uniform1i(prevFrameLocation, textureUnit);



    // Bind the current framebuffer

    // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.current[currentIdx.current ]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    // Render
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);



    // Swap framebuffers and textures for next frame
    currentIdx.current = textureUnit;


    gl.flush();
    gl.endFrameEXP();

    requestAnimationFrame(frameTicker);
  }, [color]);

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
