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

// goddamin it works

let animationFrameId;

function App() {
  const clock = useClockValue();
  const dispatch = useDispatch();
  const [color, setColor] = useState([1.0, 0.5, 0.0, 1.0]);
  const [animating, setAnimating] = useState(false);
  const frameHandle = useRef(null);
  const shape = useSelector((state) => state.shape);
  const timeValue = useComputedValue(() => (clock.current), [clock]);
  const programRef = useRef(null);
  const glRef = useRef(null);
  const framebuffers = useRef([null, null]);
  const framebuffer = useRef(null);
  const texture = useRef(null);
  const textures = useRef([null, null]);
  const currentIdx = useRef(0)
  const boldness = useRef(0)
  const preRenderFramebuffer = useRef(null)
  const preRenderTexture = useRef(null)

  const onContextCreate = (gl) => {
    glRef.current = gl;

    // Vertex Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        gl_Position = vec4(position, 0, 1);
        vUv = position * .5 + .5;; 
      }
    `);
    gl.compileShader(vertShader);

    // Fragment Shader
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, `
    
    precision highp float;
    uniform vec4 u_color;
    uniform float time;
    uniform float boldness;
    uniform sampler2D u_prevFrame;
    uniform vec2 resolution;
    varying vec2 vUv;
    uniform sampler2D u_preRenderTexture; 

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

    const int cellTimeStep = 1;
    const int lossThreshold = -2;

    int getCellSize() {
      return 1;
    }

    int pmod(int x, int m) {
      return x - ((x / m) * m);
    }
    
    int umod(int x, int m) {
      int positive = pmod(x, m);
      int negative = m - pmod((-x), m);
      return x >= 0 ? positive : negative;
    }
    
    int umod(float x, float m) {
        int xi = int(x);
        int mi = int(m);
        int positive = pmod(xi, mi);
        int negative = mi - pmod((-xi), mi);
        return xi >= 0 ? positive : negative;
    }

    ivec2 umod2(vec2 v, vec2 m) {
      return ivec2(umod(v.x, m.x), umod(v.y, m.y));
    }
  

    int sampleValue() {
        return int(texture2D(u_prevFrame, gl_FragCoord.xy/resolution).r);
    }

    int initialValue(vec2 coord) {
      vec2 center = resolution.xy / float(getCellSize()) / 2.0;
      int dist = int(distance(coord, center));
      return umod(dist, totalCategories);   
    }

    int battle(int self, int other) {
      const int center = (totalCategories - 1) / 2;
      int difference = self - center;
      int newOther = umod(other - difference, totalCategories);
      return int(sign(float(center - newOther)));
    }

    int battleWithNeighbor(int value, ivec2 coord) {
      vec2 coordFloat = vec2(float(coord.x), float(coord.y));
      return battle(value, int(texture2D(u_prevFrame, coordFloat/resolution).r));
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

    int getValue(vec2 pos) {
      return int(texture2D(u_prevFrame, pos/resolution).r);
    }
    

    void main() {

      vec4 fragColor;
      vec3 color;
      int intTime = int(time);

      if(intTime <= 1) {
        int initValue = initialValue(gl_FragCoord.xy);
        float scaledValue = float(initValue) / float(totalCategories);

        // Compute separate values for each color channel
        float r = sin(scaledValue * 6.28318530718 + 0.0) * 0.5 + 0.5;
        float g = sin(scaledValue * 6.28318530718 + 2.09439510239) * 0.5 + 0.5;
        float b = sin(scaledValue * 6.28318530718 + 4.18879020478) * 0.5 + 0.5;

        color = vec3(r, g, b);
        fragColor = vec4(color, 1.0);
      } else {


        if (umod(intTime, cellTimeStep) != 0) {
          fragColor = texture2D(u_prevFrame, gl_FragCoord.xy);
          return;
        }

        int last = sampleValue();

        int score = 0;
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            if (x != 0 || y != 0) {
              score += battleWithNeighbor(last, umod2(gl_FragCoord.xy * float(getCellSize()) + float(getCellSize()) * vec2(x, y), resolution));
            }
          }
        }
        
        int new = last;
        if (score <= lossThreshold) {
          new = umod(new - 1, totalCategories);
        }

        vec4 tempColor;
        
        // tempColor = texture2D(u_preRenderTexture, gl_FragCoord.xy / resolution); 
        // fragColor = vec4(colorFromValue(int(tempColor.r)), 1.0);
        fragColor = vec4(float(new), 0.0, 0.0, 1.0);
        // fragColor = tempColor;
        // fragColor = tempColor;


      }

      
      gl_FragColor = fragColor;

      // vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

      // float t = time*0.1;
      // float lineWidth = 0.002;
      

      // vec3 color = vec3(0.0);
      // for(int j = 0; j < 3; j++){
      //   for(int i=0; i < 5; i++){
      //     color[j] += lineWidth*float(i*i) / sin(t + 0.1*float(j)+float(i)*0.0001)*0.9 - length(uv)*0.2 + mod(sin(uv.x+ + uv.y ), boldness );
      //   }
      // }

      // vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
			
      // gl_FragColor = vec4(color[0],color[1],color[2],1.0) - vec4(prevFrameColor[2], prevFrameColor[2], prevFrameColor[2], 1.0)*0.6;
      
      
  }

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

    const preRenderFramebuffer = gl.createFramebuffer();
    const preRenderTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, preRenderTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, preRenderFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, preRenderTexture, 0);

    preRenderFramebuffer.current = preRenderFramebuffer;
    preRenderTexture.current = preRenderTexture;


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
  

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Framebuffer is not complete:', gl.checkFramebufferStatus(gl.FRAMEBUFFER));
    }
  

    frameTicker()
  };

  const frameTicker = useCallback(() => {
    if(animationFrameId) {

    if(frameHandle && glRef.current) {


    const gl = glRef.current;
    const program = programRef.current;

    const currIdx = currentIdx.current;
    const prevIdx = (currentIdx.current + 1) % 2;

    currentIdx.current = prevIdx;



    gl.useProgram(program);

    // Get uniform locations
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const boldnessLocation = gl.getUniformLocation(program, 'boldness');
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    // Set uniform values
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(timeLocation, timeValue.current / 1000);  // Convert ms to seconds
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
    if(boldness && boldness.current) {
      gl.uniform1f(boldnessLocation, boldness.current);
    }
    // console.log(timeValue.current)

    gl.activeTexture(gl.TEXTURE1);  // Use a different texture unit
    gl.bindTexture(gl.TEXTURE_2D, preRenderTexture.current);
    gl.uniform1i(gl.getUniformLocation(program, 'u_preRenderTexture'), 1);  // Tell the shader program about it

    gl.activeTexture(gl.TEXTURE0);

     // Render to default framebuffer (null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   
    gl.bindTexture(gl.TEXTURE_2D, textures.current[prevIdx]);
    gl.uniform1i(gl.getUniformLocation(program, 'u_prevFrame'), 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.current[currIdx]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, preRenderFramebuffer.current);

  
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

   
    gl.flush();
    gl.endFrameEXP();
  }

    animationFrameId = requestAnimationFrame(frameTicker);
  } else {
    cancelAnimationFrame(animationFrameId);
  }

  }, []);


  useEffect(() => {
    animationFrameId = requestAnimationFrame(frameTicker)

    setTimeout(() => {
      dispatch(setParams({
        frequency: 0.3,
        step: 0.3,
        rotation: 0.3,
        boldness: 0.01
      }))
    }, 1)

    return () => {
      // Your cleanup code here
      console.log('Component will unmount');
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null
      // frameHandle.current = null;
    };

  }, [])

  useEffect(() => {
    if(boldness && shape && shape.params && shape.params.boldness) {
      boldness.current = shape.params.boldness
    }

  }, [shape])



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}>
      <GLView style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}} onContextCreate={onContextCreate} />
    </View>
  );
}

export default App;
