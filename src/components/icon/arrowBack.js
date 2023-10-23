import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="10" height="18" viewBox="0 0 10 18">
                <Path
                    style={[styles.icon, props.style]}
                    d="M8.94405 0.546875L1.02029 8.50749L9.02246 16.5469"
                />
            </Svg>
        </View>
    )
}

export default Icon;