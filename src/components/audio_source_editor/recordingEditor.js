import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';

const RecordingEditor = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <CustomText>Recording Editor</CustomText>
        </View>
    );
};

export default RecordingEditor;
