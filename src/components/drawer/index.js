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
    Easing,
} from 'react-native-reanimated';
import { runOnJS } from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { toggleDrawer } from "../../redux";
import Theme from "../../styles/theme"

// Drawer views
import VizSettings from "./views/viz_settings";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = React.forwardRef(({ children }, ref) => {
    const app = useSelector((state) => state.app);
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const dispatch = useDispatch();

    const scrollTo = useCallback((destination) => {
        'worklet';
        active.value = destination !== 0;

        translateY.value = withTiming(destination, {
            duration: 500,
            easing: Theme.easing1,
        })
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
        scrollTo,
        isActive,
    ]);

    const dispatchToggleDrawer = () => {
        dispatch(toggleDrawer({ drawerOpen: false, drawerType: null, drawerData: null, drawerDraggable: false }));
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
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const renderDrawerContent = () => {
        if(app.drawerOpen) {
            switch (app.drawerType) {
                case 'viz_settings':
                    return <VizSettings />
                default:
                    return
            }
        }
        
    }

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                <BlurView 
                    style={styles.absolute} 
                    blurType="dark"
                    blurAmount={30}
                />
                {app.drawerDraggable && <View style={styles.line} /> }
                <View style={styles.tint} />
                {renderDrawerContent()}
                {children}



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
        opacity: 0.2,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 25,
      },

      tint: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 25,
        backgroundColor: "rgba(0,0,0,0.6)",
      }
});

export default BottomSheet;
