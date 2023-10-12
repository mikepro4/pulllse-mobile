import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 29, height: 22}}>
            <Svg width="29" height="22" viewBox="0 0 29 22">
                <Path
                    style={[styles.icon, props.style]}
                    d="M20.623 20.5293H27.8958L21.0776 6.89293L17.4619 14.2069L20.623 20.5293ZM20.623 20.5293H0.623047L10.623 0.529297L20.623 20.5293Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;