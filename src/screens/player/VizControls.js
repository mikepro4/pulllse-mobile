import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import CustomText from "../../components/text";

const VizControls = ({ preview }) => {
    const [time, setTime] = useState(0);
    const [timeInterval, setTimeInterval] = useState(null);

    const startInterval = ({ paramName, direction}) => {
        const timeUpdater = setInterval(() => {
            setTime(prevTime => prevTime + 100);

        }, 1)
        setTimeInterval(timeUpdater)
    }

    const stopInterval = () => {
        clearInterval(timeInterval);
        setTime(0)
    }


        // dispatch(
    //     toggleDrawer({
    //         drawerOpen: true,
    //         drawerType: "layer_settings",
    //         drawerData: {
    //             layerName: "Layer 4"
    //         },
    //         drawerDraggable: true,
    //         drawerHeight: "halfScreen"
    //     }));

  

    return (
        <View style={styles.controlsContainer}>
            <View style={styles.log}>
                <CustomText>time: {time}</CustomText>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                        startInterval({ 
                            paramName: "frequency",
                            direction: "down",
                        })
                    }}
                    onPressOut={() => {
                        console.log("press out")
                        stopInterval()
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control -</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control +</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control -</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control +</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control -</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control +</CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control -</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                    onPressIn={() => {
                        console.log("press in")
                    }}
                    onPressOut={() => {
                        console.log("press out")
                    }}
                    activeOpacity={1}
                    style={styles.gridItem}>
                    <CustomText>Control +</CustomText>
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
        margin: 5,
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
