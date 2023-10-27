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
    useTouchHandler,
    useValue,
    vec,
} from '@shopify/react-native-skia';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import React, { useEffect } from 'react';
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

import CustomText from '../../../../components/text';

export const useClock = () => {
    const clock = useSharedValue(0);
    useFrameCallback((info) => {
        clock.value = clock.value + 100
    });
    return clock;
};

function Ethereal() {
    const progress = useValue(0);
    const clock = useClock();

    // const path = useComputedValue(() => {
    //     const circles = Skia.Path.Make();
    
    //     for (let index = 0; index < 1500; index++) {
 
    //       circles.addCircle(x, y, radius);
    //     }
    
    //     return circles;
    // }, [clock.value]);

    const circles = Skia.Path.Make();

    circles.addCircle(10, 10, 10);

    let path = circles

    // const transform = useDerivedValue(
    //     () => [{ translateY: 100 }, { rotate: (Math.PI * clock.value) / 4000 }],
    //     [clock]
    // );

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
        <>
            <View style={styles.etherealLogger}>
                {renderParam("Clock", clock.value)}
            </View>
            <Canvas
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
            </Canvas>
        </>
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
