import {
    BlurMask,
    Canvas,
    Extrapolate,
    Group,
    interpolate,
    Path,
    runTiming,
    Skia,
    SweepGradient,
    useComputedValue,
    useClockValue,
    useTouchHandler,
    useValue,
    vec,
} from '@shopify/react-native-skia';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Easing,
    cancelAnimation,
    useFrameCallback,
    useSharedValue,
    withRepeat,
    withTiming,
    useDerivedValue
} from "react-native-reanimated";

const { width, height } = Dimensions.get('window');
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../../../../components/text';



function Ethereal() {
    const clock = useClockValue();
    const player = useSelector((state) => state.player);
    const [points, setPoints] = useState([]);
    // const [width, setWidth] = useState(null);
    const [layout, setLayout] = useState({ width: 0, height: 0 });

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

    let activeLayer = player.editedLayers.filter(item => item.position === 1);

    // calculateRadius = (, i) => {
    //     let radius = Math[this.state.math](this.state.rotate + this.state.freq * i) * this.state.radius * this.state.bold_rate +
    //         this.state.radius;

    //     return radius
    // }

    const path = useComputedValue(() => {
        const circles = Skia.Path.Make();

        console.log(activeLayer[0]?.params.boldness)

        for (let i = 0; i < points.length; i++) {
            circles.addCircle(points[i].x, points[i].y, 0.7);
        }

        return circles
    }, [clock, activeLayer])


   const generatePoints = () => {
        let generatedPoints = []
        for (var i = 0; i < viz.point.pointCount; i++) {
            var pt = createPoint(
                Math.random(1) * width,
                Math.random(1) * height,
                i
            );
            generatedPoints.push(pt)
        }

        setPoints(generatedPoints)

        // return points
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

    

    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
    }

    useEffect(() => {
        generatePoints()
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
    return (
        <View onLayout={handleLayout} style={{ flex: 1, position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}>
            {/* <View style={styles.etherealLogger}>
                {renderParam("Clock", clock.value)}
            </View> */}
            {activeLayer[0] && activeLayer[0].params && <Canvas
                style={{ flex: 1, position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
            // onTouch={touchHandler}
            >
                <Group
                   
                >
                    <Path path={path} />

                    <SweepGradient
                        c={vec(0, 0)}
                        colors={['cyan', 'magenta', 'yellow', 'cyan']}
                    />
                    {/* <BlurMask blur={5} style="solid" /> */}
                </Group>
            </Canvas>}
        </View>
    );

}

export default Ethereal;

const styles = StyleSheet.create({
    etherealLogger: {
        position: "absolute",
        zIndex: 1,
        bottom: 100,
        left: 20,
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
})
