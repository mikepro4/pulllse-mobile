import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import CustomText from '../../../../components/text';
// import {
//     Circle, 
//     useCanvasRef, 
//     createPicture,
//     Canvas,
//     Picture,
//     Skia,
//     Group,
// } from "@shopify/react-native-skia";

import Canvas from 'react-native-canvas';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

let etherealClockId;
let rotate = 0;

const Ethereal = ({ preview, layer }) => {
    // const ref = useCanvasRef();
    // const [time, setTime] = useState(0);
    const ref = useRef()
    const [points, setPoints] = useState([]);
    const [paused, setPaused] = useState(false);
    const [timeInterval, setTimeInterval] = useState(false);
    const [dimensions, setDimensions] = useState(null);

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

    //  const startInterval = ({ paramName, direction}) => {
    //     const timeUpdater = setInterval(() => {
    //         setTime(prevTime => prevTime + 100);

    //     }, 1)
    //     setTimeInterval(timeUpdater)
    // }

    // const stopInterval = () => {
    //     clearInterval(timeInterval);
    //     setTime(0)
    // }
    const startClock = () => {
        const update = () => {
            // cons newValue = time + 100;
            // setTime(prevTime => prevTime + 100);
            renderOnce()
            etherealClockId = requestAnimationFrame(update)
        }

        requestAnimationFrame(update);
        // const timeUpdater = setInterval(() => {
        //     // setTime(prevTime => prevTime + 100);
        //     time = time + 100

        // }, 1)
        // setTimeInterval(timeUpdater)
    }

    const stopClock = () => {
        // clearInterval(timeInterval);
        rotate = 0
        cancelAnimationFrame(etherealClockId);
    }

    const generatePoints = () => {
        let generatedPoints = []
        for (var i = 0; i < viz.point.pointCount; i++) {
            var pt = createPoint(
                Math.random(1) * SCREEN_WIDTH,
                Math.random(1) * SCREEN_HEIGHT,
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

    const startViz = () => {
        generatePoints()
        // setTimeout(() => {
        //     renderOnce()
        // }, 1)
    }

    const calculateRadius = (i) => {
        let radius = Math[viz.shape.math](rotate + viz.shape.freq * i) * viz.shape.radius * viz.shape.boldRate + viz.shape.radius;

        return radius
    }

    const handleLayout = (event) => {
        let scale = 1
        const { width, height } = event.nativeEvent.layout;
        // let scaleValue = (width * 2) / 4 * scale;

        setDimensions({
            width: width,
            height: height,
            radius: 1 ,
            x: (width) / 10,
            y: (height) / 10
        })
    }


    const renderOnce = () => {
        // const pixelRatio = PixelRatio.get();
        const canvas = ref.current;
        if (canvas) {
            canvas.width = SCREEN_WIDTH;
            canvas.height = SCREEN_HEIGHT;
            const ctx = canvas.getContext('2d');
            // ctx.scale(pixelRatio, pixelRatio);
            ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            rotate = rotate + 0.1;
            soundModifier = 0
            // ctx.fillStyle = `grey`;
            // console.log(points)

            // ctx.beginPath();
            // ctx.arc(200, rotate + 300, 50, 0, 2 * Math.PI); // Adjust coordinates and radius
            // ctx.fillStyle = "#ffffff";
            // ctx.fill();

            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                console.log(point.x, point.y)
                // if (point) {
                    // console.log(point)
                    let t_radius = calculateRadius(i)

                    let tx = dimensions.x + Math.cos(rotate + viz.shape.step * i + soundModifier) * t_radius;
                    let ty = dimensions.y + Math.sin(rotate + viz.shape.step * i + soundModifier) * t_radius;

                    point.vx += (tx - point.x) * viz.shape.rotatePointSpeed;
                    point.vy += (ty - point.y) * viz.shape.rotatePointSpeed;

                    point.x += point.vx;
                    point.y += point.vy;

                    point.vx *= viz.shape.friction;
                    point.vy *= viz.shape.friction;

                    // if (point.x >= 0 && point.x <= dimensions.width && point.y >= 0 && point.y <= dimensions.height) {
                    // ctx.beginPath();
                    // ctx.arc(point.x, point.y, viz.point.pointSize, 0, 2 * Math.PI);
                    // ctx.fillStyle = "#ffffff";
                    // ctx.fill();

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, viz.point.pointSize, 0, 2 * Math.PI); // Adjust coordinates and radius
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    // }
                // }
            }

            // ctx.fillStyle = '#222222';
            // ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        }
    }

    useEffect(() => {
        startViz()
        startClock()

        return () => {
            console.log("unmounted")
            stopClock()
        };
    }, []);


    // useEffect(() => { 
    //     console.log(points)  
    // }, [points]);

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


    return (
        <View style={styles.container} onLayout={handleLayout}>
            <View style={styles.etherealLogger}>
                {renderParam("Rotate", rotate)}
            </View>

            <Canvas style={styles.canvas} ref={ref} />
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
