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


     
    const float PI = 3.1415926535897932384626433832795;
    const float TAU = PI * 2.;
    const float HALF_PI = PI * .5;
      
    float wiggly(float cx, float cy, float amplitude, float frequency, float spread){
    
      float w = sin(cx * amplitude * frequency * PI) * cos(cy * amplitude * frequency * PI) * spread;
    
      return w;
    }
    
    
    void coswarp(inout vec3 trip, float warpsScale ){
    
      trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (time * .25));
      trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (time * .25));
      trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (time * .25));
      
    }
    
    
    void uvRipple(inout vec2 uv, float intensity){
    
      vec2 p = uv -.5;
    
    
        float cLength=length(p);
    
         uv= uv +(p/cLength)*cos(cLength*15.0-time*.5)*intensity;
    
    } 
    
    float smoothMod(float x, float y, float e){
        float top = cos(PI * (x/y)) * sin(PI * (x/y));
        float bot = pow(sin(PI * (x/y)),2.);
        float at = atan(top/bot);
        return y * (1./2.) - (1./PI) * at ;
    }
    
     
     vec2 modPolar(vec2 p, float repetitions) {
        float angle = 2.*3.14/repetitions;
        float a = atan(p.y, p.x) + angle/2.;
        float r = length(p);
        //float c = floor(a/angle);
        a = smoothMod(a,angle,033323231231561.9) - angle/2.;
        //a = mix(a,)
        vec2 p2 = vec2(cos(a), sin(a))*r;
       
       p2 += wiggly(p2.x + time * .05, p2.y + time * .05, 2., 4., 0.05);
       
      
    
        return p2;
    }
    
      float stroke(float x, float s, float w){
      float d = step(s, x+ w * .5) - step(s, x - w * .5);
      return clamp(d, 0., 1.);
    }
      
     //	Classic Perlin 2D Noise
    //	by Stefan Gustavson
    //
    vec4 permute(vec4 x)
    {
        return mod(((x*34.0)+1.0)*x, 289.0);
    }
    
    
    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }
      
    vec2 rotate2D (vec2 _st, float _angle) {
        _st -= 0.5;
        _st =  mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle)) * _st;
        _st += 0.5;
        return _st;
    }
    
    
    
    vec2 rotateTilePattern(vec2 _st){
    
      float t = (time * .25)  ;
      
        //  Scale the coordinate system by 2x2
        _st *= 2.0;
    
        //  Give each cell an index number
        //  according to its position
        float index = 0.0;
        index += step(1., mod(_st.x,2.0));
        index += step(1., mod(_st.y,2.0))*2.0;
    
        //      |
        //  2   |   3
        //      |
        //--------------
        //      |
        //  0   |   1
        //      |
    
        // Make each cell between 0.0 - 1.0
        _st = fract(_st);
    
        // Rotate each cell according to the index
      
       if(index == 0.0){
            //  Rotate cell 1 by 90 degrees
            _st = rotate2D(_st,PI*0.5 +(t *.8));
        }
      
        if(index == 1.0){
            //  Rotate cell 1 by 90 degrees
            _st = rotate2D(_st,PI*0.5 +t);
        } else if(index == 2.0){
            //  Rotate cell 2 by -90 degrees
            _st = rotate2D(_st,PI*-0.5 -t);
        } else if(index == 3.0){
            //  Rotate cell 3 by 180 degrees
            _st = rotate2D(_st,PI - (t * .8));
        }
    
        return _st;
    }
    
      vec2 tile(vec2 st, float _zoom){
        float vTime = time;
        st *= _zoom;
      
        return fract(st);
    }
    
      vec2 rotateUV(vec2 uv, vec2 pivot, float rotation) {
      mat2 rotation_matrix=mat2(  vec2(sin(rotation),-cos(rotation)),
                                  vec2(cos(rotation),sin(rotation))
                                  );
      uv -= pivot;
      uv= uv*rotation_matrix;
      uv += pivot;
      return uv;
    }
      
    void coswarp2(inout vec2 trip, float warpsScale ){
    
      float vTime = time;
      trip.xy += warpsScale * .1 * cos(3. * trip.yx + (vTime * .25));
      trip.xy += warpsScale * .05 * cos(11. * trip.yx + (vTime * .25));
      trip.xy += warpsScale * .025 * cos(17. * trip.yx + (vTime * .25));
     
    }
      
    float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
        return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
    }
    
    float shape( in vec2 p, float sides ,float size)
    {
      
       float d = 0.0;
      vec2 st = p *2.-1.;
    
      // Number of sides of your shape
      float N = sides ;
    
      // Angle and radius from the current pixel
      float a = atan(st.x,st.y)+PI ;
      float r = (2.* PI)/(N) ;
    
      // Shaping function that modulate the distance
      d = cos(floor(.5+a/r)*r-a)*length(st);
      
    
      return  1.0-smoothstep(size,size +.1,d);
    }
    
      
    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      
      float vTime = time * .5 ;
      float t = (time * .25) + length(uv -.5) ;
      
      uv = rotateTilePattern(uv);
      uv = rotateTilePattern(uv);
      
       vec2 rote = rotateUV(uv, vec2(.5), PI * vTime * .05);
      vec2 roteC = rotateUV(uv, vec2(.5), -PI * vTime * .05);
      
      
     vec3 color = vec3(1.);
      
      float tri1 = step(shape(rote, 3., sin(vTime)),  .5);
      
        float tri2 = step(shape(roteC, 3., cos(vTime)), .5);
      
      
     float tri3 = step(shape(rote * 1.3, 3., sin(vTime * .65)),  .5);
      
        float tri4 = step(shape(roteC * 1.2, 3., cos(vTime * .7)), .5);
      
      
      color = mix(color, 1.-color, step(shape(uv, 3., .3), .5));
      
      
        color = mix(color, 1.-color, tri1);
      
         color = mix(color, 1.-color, tri2);
      
           color = mix(color, 1.-color, tri3);
      
           color = mix(color, 1.-color, tri4);
      
      
      
      //
      
      
        rote = rotateUV(vUv, vec2(.5), PI * vTime * .05);
       roteC = rotateUV(vUv, vec2(.5), -PI * vTime * .05);
      
      
    
      
       tri1 = step(shape(rote, 3., sin(vTime)),  .5*boldness);
      
         tri2 = step(shape(roteC, 3., cos(vTime)), .5*boldness);
      
      
      tri3 = step(shape(rote * 1.3, 3., sin(vTime * .65)),  .5);
      
         tri4 = step(shape(roteC * 1.2, 3., cos(vTime * .7)), .5);
      
      
      color = mix(color, 1.-color, step(shape(uv, 3., .3), .5));
      
      
        color = mix(color, 1.-color, tri1);
      
         color = mix(color, 1.-color, tri2);
      
           color = mix(color, 1.-color, tri3);
      
           color = mix(color, 1.-color, tri4);

      // float t = time*0.1;
      float lineWidth = 0.002;
      

      // vec3 color = vec3(0.0);
      // for(int j = 0; j < 3; j++){
      //   for(int i=0; i < 5; i++){
      //     color[j] += lineWidth*float(i*i) / sin(t + 0.1*float(j)+float(i)*0.0001)*0.9 - length(uv)*0.2 + mod(fract(uv.x + uv.y), boldness);
      //   }
      // }

      vec4 prevFrameColor = texture2D(u_prevFrame, gl_FragCoord.xy/resolution);
			
      // gl_FragColor = vec4(color[0],color[1],color[2],1.0) - vec4(prevFrameColor[2], prevFrameColor[2], prevFrameColor[2], 1.0)*0.6;
      
      
        gl_FragColor = vec4(vec3(color.r, color.g, color.b), 1.0);
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
