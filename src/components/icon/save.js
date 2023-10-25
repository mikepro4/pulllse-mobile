import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View>
            <Svg width="16" fill="none" height="16" viewBox="0 0 16 16">
                <Path
                    style={[{fill: "white"}, props.style]}
                    fillRule="evenodd"
                    d="M4.486.5H2.924a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V5.121a2 2 0 00-.586-1.414l-2.621-2.621A2 2 0 0011.302.5H4.487zm-.5 1v2.125c0 .76.616 1.375 1.375 1.375h6.125c.76 0 1.375-.616 1.375-1.375v-.98l1.77 1.77a1 1 0 01.293.706V13.5a1 1 0 01-1 1H12.86v-4.313c0-.759-.615-1.374-1.375-1.374H5.361c-.76 0-1.375.615-1.375 1.374v3.938c0 .15.066.283.17.375H2.924a1 1 0 01-1-1v-11a1 1 0 011-1h1.062zm.831 13h7.044v-4.313a.375.375 0 00-.375-.374H5.361a.375.375 0 00-.375.374v3.938c0 .15-.065.283-.169.375zm7.078-12.806a.499.499 0 00-.034.181v1.75a.375.375 0 01-.375.375H5.361a.375.375 0 01-.375-.375V1.5h6.317a1 1 0 01.592.194z"
                    clipRule="evenodd"
                />
            </Svg>
        </View>
    )
}

export default Icon;