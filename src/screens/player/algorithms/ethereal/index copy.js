import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { Canvas, Group, Drawing, Skia } from "@shopify/react-native-skia";
import CustomText from '../../../../components/text';

import {
    Easing,
    cancelAnimation,
    useFrameCallback,
    useSharedValue,
    withRepeat,
    withTiming,
  } from "react-native-reanimated";

// import Canvas from 'react-native-canvas';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const Ethereal = ({ preview, layer }) => {
    const ref = useRef()
    // const clock = useSharedValue(0);
    
    // const [rotate, setRotate] = useState(0);
    const [dimensions, setDimensions] = useState(null);
    const [points, setPoints] = useState([]);

    let viz = {
        shape: {
            rotateSpeed: -0.016000000000000007,
            friction: 0.01,
            rotatePointSpeed: 0.01,
            step: 16.500159999999994,
            frequency: 8.400099999999998,
            boldRate: 0.72,
            math: "cos",
            backgroundColor: "#000000"
        },
        point: {
            pointSize: 1.3,
            pointOpacity: 1,
            pointCount: 1024,
            pointColor: "#ffffff"
        },
        overlay: {
            visible: false,
            blur: 222,
            color: "#000000",
            colorOpacity: 0.6
        },
    }

    

    const handleLayout = (event) => {
        let scale = 1
        const { width, height } = event.nativeEvent.layout;
        console.log(width, height)
        setDimensions({
            width: width,
            height: height,
            radius: 1,
            x: width / 2,
            y: height / 2
        })
    }

    useEffect(() => {
        // startClock()
        generatePoints()
        

        return () => {
            console.log("unmounted")
            // stopClock()
        };
    }, []);

    const renderParam = (name, value) => {
        return (
            <View style={styles.paramContainer}>
                <View style={styles.paramTitleContainer}>
                    <CustomText style={styles.paramTitle}>{name}</CustomText>
                </View>

                <View style={styles.paramValue}>
                    <CustomText style={styles.paramValue}>{value}</CustomText>
                </View>
            </View>
        )
    }


    const size = 256;
    const r = size * 0.33;

    const generatePoints = () => {
        let generatedPoints = []
        for (var i = 0; i < viz.point.pointCount; i++) {
            var pt = createPoint(
                Math.random(1) * viz.point.pointSize,
                Math.random(1) * viz.point.pointSize,
                i
            );
            generatedPoints.push(pt)
        }

        setPoints(generatedPoints)

        return points
    }

    const createPoint = (x, y, i) => {

        let point = {
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            color: "#ffffff",
        }

        return point
    }

    // renderDrawing = (canvas, paint) => {
    //     // console.log(points)
    //     const size = 256;
    //     if(points.length > 0) {
    //         // paint.setColor(Skia.Color("cyan"));
    //         // canvas.drawCircle(r, r, r, paint);
    //         // paint.setColor(Skia.Color("magenta"));
    //         // canvas.drawCircle(size - r, r, r, paint);
    //         // paint.setColor(Skia.Color("yellow"));
    //         // canvas.drawCircle(size / 2, size - r, r, paint);
    //         for (let i = 0; i < points.length; i++) {
    //             paint.setColor(Skia.Color("cyan"));
    //             canvas.drawCircle(points[i].x, points[i].y, 2, paint);
    //         }
    //     }
    // }

    return (
        <View style={styles.container} onLayout={handleLayout}>
            <View style={styles.etherealLogger}>
                {renderParam("Rotate", rotate)}
            </View>

            <Canvas style={styles.canvas}>
                <Group blendMode="multiply">
                    <Drawing
                        drawing={({ canvas, paint }) => renderDrawing(canvas, paint)}
                    />
                </Group>
            </Canvas>
        </View>
    );
};

export default Ethereal;

const styles = StyleSheet.create({
    etherealLogger: {
        position: "absolute",
        zIndex: 1,
        bottom: 100,
        left: 20,
    },
    canvas: {
        flex: 1,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    paramContainer: {
        flexDirection: "row",
        marginBottom: 2
    },
    paramTitleContainer: {
        width: 66,
    },
    paramTitle: {
        fontSize: 10,
        opacity: 0.5
    },
    paramValue: {
        fontSize: 10,
        opacity: 1
    }
});
