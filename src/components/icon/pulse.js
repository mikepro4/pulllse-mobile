import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="22" height="20" viewBox="0 0 22 20">
                <Path
                    style={[styles.icon, props.style]}
                    d="M0.932617 10.6649H5.15647L8.01595 2.09375L13.4326 18.0937L16.766 10.6649H20.9326"
                />
            </Svg>
        </View>
    )
}

export default Icon;