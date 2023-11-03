import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';

const FileEditor = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <CustomText>File Editor</CustomText>
        </View>
    );
};

export default FileEditor;
