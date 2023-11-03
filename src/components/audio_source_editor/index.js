import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import CustomText from '../text';
import RecordingEditor from './recordingEditor';
import SpotifyEditor from './spotifyEditor';
import FileEditor from './fileEditor';

const App = () => {
    const player = useSelector((state) => state.player);

    const renderEditor = () => {
        switch (player.editedPulse?.audioSourceType) {
            case "recording":
                return <RecordingEditor/>
            case "file":
                return <FileEditor/>
            case "spotify":
                return <SpotifyEditor/>
            default:
                return
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            {renderEditor()}
        </View>
    );
};

export default App;
