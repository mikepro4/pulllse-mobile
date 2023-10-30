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
      uniform float boldness;
      uniform sampler2D u_prevFrame;
      uniform vec2 resolution;

      #define TWO_PI 6.2831853072
    	#define PI 3.14159265359

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

      // int sampleValue(vec2 coord) {
      //   return texture2D(u_prevFrame, coord);
      // }


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

      // int battle(int self, int other) {
      //   const int center = (totalCategories - 1) / 2;
      //   int difference = self - center;
      //   int newOther = umod(other - difference, totalCategories);
      //   return int(sign(float(center - newOther)));
      // }

      // int battleWithNeighbor(int value, vec2 coord) {
      //   return battle(value, texture2D(u_prevFrame, coord).r);
      // }


      int initialValue(ivec2 coord) {
        vec2 center = resolution.xy / float(getCellSize()) / 2.0;
        int dist = int(distance(vec2(coord), center));
        return umod(dist, totalCategories);   
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 coord = vec2(fragCoord) / float(getCellSize());
          
          // if (umod(int(time), cellTimeStep) != 0) {
          //   fragColor = texture2D(u_prevFrame, fragCoord);
          //   return;
          // }
          
          // int last = sampleValue(vec2(fragCoord));
          // int score = 0;
          // for (int x = -1; x <= 1; x++) {
          //   for (int y = -1; y <= 1; y++) {
          //     if (x != 0 || y != 0) {
          //       score += battleWithNeighbor(last, vec2(umod2(ivec2(coord * float(getCellSize()) + float(getCellSize()) * vec2(ivec2(x, y))), ivec2(resolution.xy))));
          //     }
          //   }
          // }
          
          // int new = last;
          // if (score <= lossThreshold) {
          //   new = umod(new - 1, totalCategories);
          // }
          
          fragColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
      }
      
     
      mat2 rotation(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }
    

    	void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        vec2 pivot = vec2(0.0, 0.0);  // Center of the screen

        // uv = rotation(0.9) * (uv - pivot) + pivot;
        float t = time*0.1;
        float lineWidth = 0.002;
        

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*3.0 - length(uv) + mod(uv.x+uv.y, boldness));
          }

        }

        vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
        
        gl_FragColor = vec4(color[0],color[1],color[2],1.0) - vec4(prevFrameColor[2], prevFrameColor[2], prevFrameColor[2], 1.0)*0.6;

        vec2 fragCoord = gl_FragCoord.xy;
        vec4 fragColor;
        mainImage(fragColor, fragCoord);
        gl_FragColor = fragColor;
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

    gl.activeTexture(gl.TEXTURE0);

     // Render to default framebuffer (null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   
    gl.bindTexture(gl.TEXTURE_2D, textures.current[prevIdx]);
    gl.uniform1i(gl.getUniformLocation(program, 'u_prevFrame'), 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.current[currIdx]);

  
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
