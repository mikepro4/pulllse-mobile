import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View >
            <Svg width="24" height="24" fill="none" viewBox="0 0 21 22">
                <Path
                    style={[styles.icon, props.style]}
                    d="M16.4679 14.5682C18.7841 15.2221 20.2795 16.2562 20.2795 17.42C20.2795 19.3972 15.9636 21 10.6397 21C5.31586 21 1 19.3972 1 17.42C1 16.2562 2.49541 15.2221 4.81158 14.5682M16.5816 6.90522C16.5816 10.842 10.5452 16.0911 10.5452 16.0911C10.5452 16.0911 4.50873 10.842 4.50873 6.90522C4.50873 3.64385 7.21134 1 10.5452 1C13.879 1 16.5816 3.64385 16.5816 6.90522ZM12.5867 6.84584C12.5867 7.97313 11.6728 8.88697 10.5455 8.88697C9.41826 8.88697 8.50441 7.97313 8.50441 6.84584C8.50441 5.71855 9.41826 4.80471 10.5455 4.80471C11.6728 4.80471 12.5867 5.71855 12.5867 6.84584Z"
                />
            </Svg>
        </View>
    )
}

export default Icon;