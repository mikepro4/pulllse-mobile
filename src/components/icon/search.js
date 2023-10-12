import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 27, height: 22}}>
            <Svg width="25" height="22" viewBox="0 0 24 22">
                <Path
                    style={[styles.icon, props.style]}
                    d="M20.5098 21.4746L14.3512 15.316M16.726 9.58272C16.726 14.0607 13.0959 17.6908 8.61787 17.6908C4.13989 17.6908 0.509766 14.0607 0.509766 9.58272C0.509766 5.10473 4.13989 1.47461 8.61787 1.47461C13.0959 1.47461 16.726 5.10473 16.726 9.58272Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;