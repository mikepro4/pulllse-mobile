import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { runOnJS } from "react-native-reanimated";
import { VibrancyView } from "@react-native-community/blur";
import { toggleDrawer } from "../../redux";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = React.forwardRef(({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const dispatch = useDispatch();

    const scrollTo = useCallback((destination) => {
        'worklet';
        active.value = destination !== 0;

        translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
        scrollTo,
        isActive,
    ]);

    const dispatchToggleDrawer = () => {
        dispatch(toggleDrawer({ drawerOpen: false, drawerType: null, drawerData: null }));
    };

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                scrollTo(0);
                runOnJS(dispatchToggleDrawer)();

            } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                scrollTo(MAX_TRANSLATE_Y);

            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 5],
            Extrapolate.CLAMP
        );

        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                <VibrancyView 
                    style={styles.absolute} 
                    blurType="dark"
                    blurAmount={40}
                >
                <View style={styles.line} />

                {children}
                </VibrancyView>

            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: '100%',
        // backgroundColor: 'white',
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderRadius: 25,
        zIndex: 100,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 25,
      }
});

export default BottomSheet;
