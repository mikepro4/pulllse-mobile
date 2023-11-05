import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../../../../components/text';
import Icon from "../../../../components/icon";

import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';

const GLSL = () => {
    const player = useSelector((state) => state.player);
    const [isFocused, setIsFocused] = useState(false);

    const onContextCreate = async (gl) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    
        // Second shader setup
        const mainScene = new THREE.Scene();
        const mainMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                resolution: {
                  value: new THREE.Vector2(gl.drawingBufferWidth, gl.drawingBufferHeight),
                },
              },
              vertexShader: `
                void main() {
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
        
                void main() {
                  vec2 st = gl_FragCoord.xy / resolution.xy;
                  gl_FragColor = vec4(st.x, st.y, 0.5 + 0.5 * sin(time), 1.0);
                }
              `,
        });
        const mainGeometry = new THREE.PlaneGeometry(2, 2);
        const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
        mainScene.add(mainMesh);
    
        const animate = () => {
            requestAnimationFrame(animate);

            // Use Date.now() instead of performance.now()
            const currentTime = Date.now() * 0.001; // Convert to seconds
            material.uniforms.time.value = currentTime;
          
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.03;
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
    
        animate();
      };
    
      useEffect(() => {
        // Clean up
      }, []);

    return (
            <View style={{flex: 1, position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>

                <CustomText>GLSL</CustomText>
                <GLView style={{ flex: 1,  position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} onContextCreate={onContextCreate} />

            </View>
    );
};

export default GLSL;


const styles = StyleSheet.create({
});
