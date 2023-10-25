import React from 'react';
import { View, Text } from 'react-native';
import CustomText from "../../components/text";

const Viz = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{ width: 200, height: 200, backgroundColor: "#333", borderRadius: 100}}>
            </View>
        </View>
    );
};

export default Viz;
