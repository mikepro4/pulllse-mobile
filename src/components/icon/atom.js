import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import styles from './indexStyle';

const Icon = (props) => {
    return (
        <View>
            <Svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <Path
                    style={[{ fill: "white" }, props.style]}
                    fill="#fff"
                    fillRule="evenodd"
                    d="M3.253 1.902c-.547-.027-.898.104-1.11.315-.21.21-.341.562-.314 1.11.027.546.212 1.231.562 2.016A14.03 14.03 0 003.663 7.56 23.89 23.89 0 015.47 5.542a23.892 23.892 0 012.018-1.805A14.027 14.027 0 005.27 2.464c-.785-.35-1.47-.535-2.017-.562zm5.072 1.202c-.914-.655-1.812-1.18-2.647-1.553-.851-.38-1.662-.612-2.376-.648-.713-.035-1.386.127-1.866.607-.48.48-.642 1.152-.606 1.866.035.713.268 1.524.648 2.375.372.835.897 1.733 1.552 2.647-.654.915-1.18 1.813-1.552 2.648-.38.85-.613 1.662-.648 2.375-.035.713.126 1.386.607 1.866.48.48 1.152.642 1.866.607.713-.036 1.524-.269 2.375-.648.835-.373 1.733-.898 2.647-1.553.915.655 1.812 1.18 2.648 1.553.85.38 1.661.612 2.375.648.713.035 1.386-.127 1.866-.607.48-.48.642-1.153.606-1.866-.035-.713-.268-1.524-.648-2.375-.372-.835-.897-1.733-1.552-2.648.655-.914 1.18-1.812 1.553-2.647.38-.85.612-1.662.647-2.375.036-.714-.126-1.386-.606-1.866-.48-.48-1.153-.642-1.866-.607-.714.036-1.525.268-2.375.648-.836.373-1.733.898-2.648 1.553zm0 1.246a22.686 22.686 0 00-2.15 1.9c-.71.71-1.345 1.434-1.898 2.148.553.715 1.189 1.44 1.899 2.15s1.435 1.346 2.15 1.899a22.699 22.699 0 002.149-1.9 22.68 22.68 0 001.898-2.149 22.7 22.7 0 00-1.899-2.149A22.693 22.693 0 008.325 4.35zm4.662 3.21a23.903 23.903 0 00-1.806-2.018 23.889 23.889 0 00-2.018-1.805 14.03 14.03 0 012.217-1.273c.785-.35 1.47-.535 2.017-.562.547-.027.899.104 1.11.315.21.21.342.562.315 1.11-.027.546-.212 1.231-.563 2.016a14.021 14.021 0 01-1.272 2.217zm0 1.677a23.897 23.897 0 01-1.805 2.018 23.877 23.877 0 01-2.019 1.805c.775.535 1.525.964 2.217 1.273.785.35 1.47.535 2.017.562.547.027.899-.104 1.11-.315.21-.211.342-.563.315-1.11-.028-.546-.212-1.232-.563-2.017a14.026 14.026 0 00-1.272-2.216zm-5.5 3.823a23.901 23.901 0 01-2.018-1.805 23.892 23.892 0 01-1.806-2.018 14.03 14.03 0 00-1.272 2.216c-.35.786-.535 1.47-.562 2.018-.027.546.104.898.315 1.11.21.21.562.341 1.11.314.546-.027 1.231-.212 2.016-.562a14.036 14.036 0 002.217-1.273zm.838-5.162a.5.5 0 01.5.5v.066a.5.5 0 01-1 0v-.066a.5.5 0 01.5-.5z"
                    clipRule="evenodd" />
            </Svg>
        </View>
    )
}

export default Icon;