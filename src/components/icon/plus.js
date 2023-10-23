import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="22" height="22" viewBox="0 0 22 22">
                <Path
                    style={[styles.icon, props.style]}
                    d="M10.9535 21.4746L10.9535 11.4227M10.9535 11.4227L10.9535 1.47461M10.9535 11.4227H1M10.9535 11.4227H21"
                />
            </Svg>
        </View>
    )
}

export default Icon;