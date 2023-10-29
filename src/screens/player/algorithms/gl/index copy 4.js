import React, { useCallback, useRef, useState } from 'react';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import CustomText from '../../../../components/text';

const vertShader = `
  precision highp float;
  uniform vec2 u_rotation;
  attribute vec2 a_position;
  varying vec2 uv;
  void main () {
  
    vec2 rotatedPosition = vec2(
      a_position.x * u_rotation.y + a_position.y * u_rotation.x,
      a_position.y * u_rotation.y - a_position.x * u_rotation.x
    );
    
    uv = a_position;
    gl_Position = vec4(rotatedPosition, 0, 1);
  }
`;

const fragShader = `
  precision highp float;
  uniform sampler2D u_texture;
  varying vec2 uv;
  void main () {
    gl_FragColor = texture2D(u_texture, vec2(uv.y, uv.x));
  }
`;

export default function HelloExpoGL() {

  const [animating, setAnimating] = useState(false);
  const contextRef = useRef(null);
  const textureRef = useRef(null);
  const rotationRef = useRef(null);

  const vertices = new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
  ]);

  const onTestContextCreate = useCallback(async (gl) => {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vertShader);
    gl.compileShader(vert);

    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fragShader);
    gl.compileShader(frag);

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionAttrib = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    const asset = Asset.fromModule(require('./coin.png'));
    await asset.downloadAsync();

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset);

    const textureLocation = gl.getUniformLocation(program, 'u_texture');
    const rotationLocation = gl.getUniformLocation(program, 'u_rotation');

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(textureLocation, 0);
    gl.uniform2fv(rotationLocation, [Math.cos(0), Math.sin(0)]);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    gl.flush();
    gl.endFrameEXP();

    contextRef.current = gl;
    textureRef.current = textureLocation;
    rotationRef.current = rotationLocation;

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

  return (
    <View style={styles.fill}>
      <GLView style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0,  justifyContent: 'center', alignItems: 'center', zIndex:1, flex: 1}} onContextCreate={onTestContextCreate} />
      <TouchableOpacity style={{zIndex: 2, position: "absolute"}} onPress={handleToggleAnimation}>
        <CustomText >{animating ? 'Stop' : 'Animate'}</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute", top: 0, bottom: 0, left: 0, right: 0,  justifyContent: 'center', alignItems: 'center', zIndex:1, flex: 1
  },
  gl: {
    position: "absolute", top: 0, bottom: 0, left: 0, right: 0,  justifyContent: 'center', alignItems: 'center', zIndex:1, flex: 1
  },
});
