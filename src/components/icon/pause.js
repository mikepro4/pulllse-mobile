import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";
import { center } from "@shopify/react-native-skia";

const Icon = (props) => {
  return (
    <View>
      <Svg
        width={props.style.width}
        height={props.style.height}
        viewBox="0 0 24 24"
        fill={props.style.color}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 14.7296 2.40002 H 18.167 C 18.4399 2.404 18.7005 2.5118 18.8935 2.70055 C 19.0865 2.88931 19.1967 3.14418 19.2008 3.41109 V 20.589 C 19.1967 20.8559 19.0865 21.1107 18.8935 21.2995 C 18.7005 21.4883 18.4399 21.5961 18.167 21.6 H 14.7296 C 14.4567 21.5961 14.1961 21.4883 14.0031 21.2995 C 13.8101 21.1107 13.6999 20.8559 13.6958 20.589 V 3.41109 C 13.6999 3.14418 13.8101 2.88931 14.0031 2.70055 C 14.1961 2.5118 14.4567 2.404 14.7296 2.40002 Z"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 5.8346 2.40002 H 9.26142 C 9.53708 2.39999 9.80168 2.50602 9.99807 2.6952 C 10.1945 2.88439 10.3069 3.14153 10.311 3.41109 V 20.589 C 10.3069 20.8585 10.1945 21.1157 9.99807 21.3048 C 9.80168 21.494 9.53708 21.6001 9.26142 21.6 H 5.8346 C 5.56168 21.5961 5.30108 21.4883 5.10807 21.2995 C 4.91507 21.1107 4.80485 20.8559 4.80078 20.589 V 3.41109 C 4.80485 3.14418 4.91507 2.88931 5.10807 2.70055 C 5.30108 2.5118 5.56168 2.404 5.8346 2.40002 Z"
        />
      </Svg>
    </View>
  );
};

export default Icon;
