import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View style={{width: 22, height: 22}}>
            <Svg width="20" height="22" fill="none" viewBox="0 0 20 22">
                <Path
                    style={[styles.icon, props.style]}
                    d="M7 19.9899C7.79613 20.618 8.84747 21 10 21C11.1525 21 12.2039 20.618 13 19.9899M1.57109 16.7575C1.09677 16.7575 0.831858 16.0216 1.11877 15.6127C1.78453 14.6639 2.42712 13.2724 2.42712 11.5967L2.45458 9.16851C2.45458 4.65717 5.83278 1 10 1C14.2286 1 17.6566 4.71104 17.6566 9.28883L17.6291 11.5967C17.6291 13.2839 18.2495 14.683 18.8882 15.6322C19.164 16.0421 18.8984 16.7575 18.43 16.7575H1.57109Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;