import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector, } from "react-redux";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, AnimationFrame } from 'react-native';
import CustomText from "../../components/text";

import {
    changeLayerParam,
    setParams
} from "../../redux"

let animationFrameId;

const VizControls = ({ preview }) => {
    const [time, setTime] = useState(0);
    const shape = useSelector((state) => state.shape);
    const [paramName, setParamName] = useState(null);
    const [direction, setDirection] = useState(null);
    const [incrementDivider, setIncrementDivider] = useState(null);
    const dispatch = useDispatch();

    // const startInterval = ({ paramName, direction}) => {
    //     const timeUpdater = setInterval(() => {
    //         setTime(prevTime => prevTime + 100);

    //     }, 1)
    //     setTimeInterval(timeUpdater)
    // }

    // const stopInterval = () => {
    //     clearInterval(timeInterval);
    //     setTime(0)
    // }


    const startInterval = ({ paramName, direction, incrementDivider }) => {
        setParamName(paramName)
        setDirection(direction)
        setIncrementDivider(incrementDivider)
        const update = () => {
            // cons newValue = time + 100;
            setTime(prevTime => prevTime + 100);
            
            animationFrameId = requestAnimationFrame(update)
        }
        
        requestAnimationFrame(update);
    }

    useEffect(() => {
        // dispatch(
        //     changeLayerParam({
        //         paramName: paramName,
        //         direction: direction,
        //         valueChange: time / incrementDivider
        //     }));
        let valueChange
        if(direction && direction === "up") {
            valueChange = shape.params[paramName] + time / incrementDivider
        } else if(direction === "down") {
            valueChange = shape.params[paramName] - time / incrementDivider
        }
        if(paramName && valueChange !== null) {
            dispatch(
                setParams({
                    ...shape.params,
                    [paramName]: valueChange
                })
            )
        }
       
    }, [time]);

    const stopInterval = () => {
        setParamName(null)
        setDirection(null)
        setIncrementDivider(null)
        setTime(0)
        cancelAnimationFrame(animationFrameId);
    }

    return (
        <View style={styles.controlsContainer}>
            {/* <View style={styles.log}>
                <CustomText>time: {time}</CustomText>
            </View> */}
            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "frequency",
                            direction: "down",
                            incrementDivider: 10000000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>-</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "frequency",
                            direction: "up",
                            incrementDivider: 1000000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>+</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "step",
                            direction: "down",
                            incrementDivider: 10000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>-</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "step",
                            direction: "up",
                            incrementDivider: 10000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>+</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "rotation",
                            direction: "down",
                            incrementDivider: 10000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>-</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "rotation",
                            direction: "up",
                            incrementDivider: 10000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>+</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "boldness",
                            direction: "down",
                            incrementDivider: 1000000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>-</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        startInterval({ 
                            paramName: "boldness",
                            direction: "up",
                            incrementDivider: 1000000
                        })
                    }}
                    onPressOut={() => {
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>+</CustomText>
                </TouchableOpacity>
            </View>

            
        </View>
    );
};

export default VizControls;

const styles = StyleSheet.create({
    log: {
        position: "absolute",
        top: 0,
        left: 0
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },

    gridItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255, 0)',
        padding: 32,
        opacity: 0,
        margin: 1,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255, 0.05)"
    },
    controlsContainer: {
        position: "absolute",
        top: 120,
        left: 0,
        right: 0,
        bottom: 120,
        // backgroundColor: "blue",
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center"
    }
})
