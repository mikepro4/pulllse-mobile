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
                    d="M4.47596 17.5017L1.44824 20.5293M21.4473 0.531049L18.4184 3.5599M18.4395 17.5204L21.4482 20.5288M1.44843 0.529297L4.38919 3.46978M14.7908 7.18564L11.4479 10.5285M11.4479 10.5285L8.10439 13.8719M11.4479 10.5285L8.10468 7.18564M11.4479 10.5285L14.7914 13.8717"
                />
            </Svg>
        </View>
    )
}

export default Icon;