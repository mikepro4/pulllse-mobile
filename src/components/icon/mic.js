import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View style={{width: 22, height: 22, position: "relative", left: 3, top: 2}}>
      <Svg width="16" fill="none" height="19" viewBox="0 0 16 19">
          <Path
            fill={props.style.fill}
            d="M5.088 1.496a3.743 3.743 0 016.39 2.647V7.8a3.743 3.743 0 01-7.487 0V4.143c0-.993.395-1.945 1.097-2.647zm2.646.904a1.743 1.743 0 00-1.743 1.743V7.8a1.743 1.743 0 103.486 0V4.143A1.743 1.743 0 007.734 2.4zm-6.48 5.325a1 1 0 011.134.845 5.402 5.402 0 0010.69 0 1 1 0 011.98.288 7.402 7.402 0 01-6.325 6.268V17.4a1 1 0 11-2 0v-2.274A7.402 7.402 0 01.41 8.858a1 1 0 01.845-1.133z"
            clipRule="evenodd"
          />
      </Svg>
  </View>
  );
};

export default Icon;
