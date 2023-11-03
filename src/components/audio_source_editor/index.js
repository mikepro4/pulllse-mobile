import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

const App = () => {
    const player = useSelector((state) => state.player);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <Text style={{  color: 'white' }}>{player.editedPulse?.audioSourceType}</Text>
        </View>
    );
};

export default App;
