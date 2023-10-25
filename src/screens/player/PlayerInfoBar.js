import React from 'react';
import { View, Text } from 'react-native';
import CustomText from "../../components/text";

const PlayerInfoBar = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CustomText>Player Info Bar</CustomText>
        </View>
    );
};

export default PlayerInfoBar;
