import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View>
            <Svg width="20" fill="none" height="21" viewBox="0 0 20 21">
                <Path
                    style={[{ fill: "white" }, props.style]}
                    fillRule="evenodd"
                    d="M3 .5a.5.5 0 01.5.5v7a.5.5 0 01-1 0V1A.5.5 0 013 .5zm7 0a.5.5 0 01.5.5v3a.5.5 0 01-1 0V1a.5.5 0 01.5-.5zm7 0a.5.5 0 01.5.5v9a.5.5 0 01-1 0V1a.5.5 0 01.5-.5zm-7 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7.5 8a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM3 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM.5 12a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm9.5-.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8a.5.5 0 01.5-.5zm7 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM14.5 14a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM3 15.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0v-4a.5.5 0 01.5-.5zm14 2a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z"
                    clipRule="evenodd"
                />
            </Svg>
        </View>
    )
}

export default Icon;