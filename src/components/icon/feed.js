import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View>
            <Svg width="24" height="24" fill="none" viewBox="0 0 20 22">
                <Path
                    style={[{ fill: "white" }, props.style]}
                    d="M9.474 6.46a.5.5 0 00-.963.002l-1.263 4.536H5.612a.5.5 0 000 1h2.016a.5.5 0 00.482-.366l.886-3.184 2.1 7.435a.5.5 0 00.95.04l1.469-3.925h1.642a.5.5 0 100-1h-1.989a.5.5 0 00-.468.325l-1.056 2.82-2.17-7.683z"
                />
                <Path
                    style={[{ fill: "white" }, props.style]}
                    fillRule="evenodd"
                    d="M5.385.672a4.5 4.5 0 00-4.5 4.5v12a4.5 4.5 0 004.5 4.5h10a4.5 4.5 0 004.5-4.5v-12a4.5 4.5 0 00-4.5-4.5h-10zm-3.5 4.5a3.5 3.5 0 013.5-3.5h10a3.5 3.5 0 013.5 3.5v12a3.5 3.5 0 01-3.5 3.5h-10a3.5 3.5 0 01-3.5-3.5v-12z"
                    clipRule="evenodd"
                />
            </Svg>
        </View>
    )
}

export default Icon;