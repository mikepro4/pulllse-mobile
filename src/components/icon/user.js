import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="22" height="21" viewBox="0 0 22 21">
                <Path
                    style={[styles.icon, props.style]}
                    d="M21.2485 18.2241C21.2485 20.8151 18.2236 20.4907 11.2539 20.4907C4.28421 20.4907 1.24854 20.8151 1.24854 18.2241C1.24854 15.6331 5.73106 13.5116 11.2539 13.5116C16.7768 13.5116 21.2485 15.6331 21.2485 18.2241Z"
                />
                <Path
                    style={[styles.icon, props.style]}
                    d="M15.7876 5.08447C15.7876 7.4164 13.7729 9.50195 11.2876 9.50195C8.80232 9.50195 6.7876 7.4164 6.7876 5.08447C6.7876 2.75254 8.80232 0.501953 11.2876 0.501953C13.7729 0.501953 15.7876 2.75254 15.7876 5.08447Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;