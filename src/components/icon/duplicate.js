import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View>
            <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <Path
                    style={[{ fill: "white" }, props.style]}
                    d="M11.122 1.5a1.5 1.5 0 011.5 1.5v6.628a1.08 1.08 0 01-1.08 1.08v1a2.08 2.08 0 002.08-2.08V3a2.5 2.5 0 00-2.5-2.5H6.718a1.971 1.971 0 00-1.971 1.972h1c0-.537.435-.972.971-.972h4.404zm-.417 4.167a2.25 2.25 0 00-2.25-2.25h-5.25a2.25 2.25 0 00-2.25 2.25v7.583a2.25 2.25 0 002.25 2.25h5.25a2.25 2.25 0 002.25-2.25V5.667zm-2.25-1.25c.69 0 1.25.56 1.25 1.25v7.583c0 .69-.56 1.25-1.25 1.25h-5.25c-.69 0-1.25-.56-1.25-1.25V5.667c0-.69.56-1.25 1.25-1.25h5.25z"
                    clipRule="evenodd" />
            </Svg>
        </View>
    )
}

export default Icon;