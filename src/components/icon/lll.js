import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="17" height="20" viewBox="0 0 17 20">
                <Path
                    style={[styles.icon, props.style]}
                    d="M0.5 0.5V19.5M8.43269 0.5L8.43269 19.5M16.5 0.5V19.5"
                />
            </Svg>
        </View>
    )
}

export default Icon;