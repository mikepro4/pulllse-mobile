import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';


const Icon = (props) => {
    return (
        <View >
            <Svg width="16" fill="none" height="16" viewBox="0 0 16 16">
                <Path
                    style={[styles.icon, props.style]}
                    d="M7.988 14.835a6.847 6.847 0 100-13.694 6.847 6.847 0 000 13.694zm0 1.141A7.988 7.988 0 107.988 0a7.988 7.988 0 000 15.976z"
                    clipRule="evenodd"
                    opacity="0.1"
                />
                <Path
                    // style={[styles.icon, props.style]}
                    fill="#fff"
                    d="M7.999 16a8 8 0 000-16v1.143a6.857 6.857 0 010 13.714V16z"
                />
            </Svg>
        </View>
    )
}

export default Icon;