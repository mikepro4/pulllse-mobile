import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';



const Icon = (props) => {
    return (
        <View>
            <Svg width="4" fill="none" height="22" viewBox="0 0 4 18">
                <Path
                    style={[styles.icon, props.style]}
                    d="M3.82812 2.76758C3.82812 3.76536 3.01926 4.57422 2.02148 4.57422C1.02371 4.57422 0.214844 3.76536 0.214844 2.76758C0.214844 1.7698 1.02371 0.960938 2.02148 0.960938C3.01926 0.960938 3.82812 1.7698 3.82812 2.76758Z"
                />
                <Path
                    style={[styles.icon, props.style]}
                    d="M3.82812 9.00195C3.82812 9.99973 3.01926 10.8086 2.02148 10.8086C1.02371 10.8086 0.214844 9.99973 0.214844 9.00195C0.214844 8.00417 1.02371 7.19531 2.02148 7.19531C3.01926 7.19531 3.82812 8.00417 3.82812 9.00195Z"
                />
                <Path
                    style={[styles.icon, props.style]}
                    d="M2.02148 17C3.01926 17 3.82812 16.1911 3.82812 15.1934C3.82812 14.1956 3.01926 13.3867 2.02148 13.3867C1.02371 13.3867 0.214844 14.1956 0.214844 15.1934C0.214844 16.1911 1.02371 17 2.02148 17Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;