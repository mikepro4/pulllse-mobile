import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 14}}>
            <Svg width="22" height="14" viewBox="0 0 22 14">
                <Path
                    style={[styles.icon, props.style]}
                    d="M1.43701 6.66617H20.8525M20.8525 6.66617L14.7411 0.554688M20.8525 6.66617L14.7411 13.5094"
                />
            </Svg>
        </View>
    )
}

export default Icon;