import React from 'react';
import { View, Text } from 'react-native';
import CustomText from "../../components/text";

const Viz = ({ preview }) => {

    let size 

    if (preview) {
        size = 100
    } else {
        size = 200
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{ width: size, height: size, backgroundColor: "#333", borderRadius: 100}}>
            </View>
        </View>
    );
};

export default Viz;
