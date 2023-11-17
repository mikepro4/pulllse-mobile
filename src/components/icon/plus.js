import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = ({ style }) => {
  return (
    <View style={{ width: style.width, height: style.height }}>
      <Svg width={style.width} height={style.height} viewBox="0 0 12 12">
        <Path
          d="M5.97674 11L5.97674 1M1 5.97404H11"
          stroke="white"
          stroke-linecap="round"
        />
      </Svg>
    </View>
  );
};

export default Icon;
