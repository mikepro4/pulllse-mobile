import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{height: 12}}>
            <Svg width="7" fill="none" height="12" viewBox="0 0 7 12">
                <Path
                    style={[styles.icon, ]}
                    d="M.93.548l4.952 4.974-5 5.023"
                />
            </Svg>
        </View>
    )
}

export default Icon;