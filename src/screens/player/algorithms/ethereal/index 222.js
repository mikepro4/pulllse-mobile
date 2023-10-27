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
    const [width, setWidth] = useState(null);
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    let activeLayer = player.editedLayers.filter(item => item.position === 1);

    const path = useComputedValue(() => {
        const circles = Skia.Path.Make();
        // console.log(clock.current / 1000 * -0.01)
        console.log(activeLayer[0]?.params.boldness)
        circles.addCircle(clock.current / 100 + 100, activeLayer[0]?.params.boldness * 3 + 100, 1.3);
        return circles
    }, [clock, activeLayer])


    createPoint = (x, y, i) => {
    }

    generatePoints = () => {
    }


    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });

        // setDimensions({
        //     width: width,
        //     height: height,
        //     radius: 1,
        //     x: (width) / 10,
        //     y: (height) / 10
        // })
    }

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
                    transform={[
                        {
                            translateX: width / 2,
                        },
                        {
                            translateY: height / 2,
                        },
                    ]}
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
