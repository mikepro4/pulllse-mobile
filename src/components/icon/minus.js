import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";
import { center } from "@shopify/react-native-skia";

const Icon = ({ style }) => {
  return (
    <View
      style={{
        width: style.width,
        height: style.height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={style.width} height={style.height} viewBox="0 0 24 24">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.30078 12C3.30078 11.1716 3.97235 10.5 4.80078 10.5L19.2008 10.5C20.0292 10.5 20.7008 11.1716 20.7008 12C20.7008 12.8284 20.0292 13.5 19.2008 13.5L4.80078 13.5C3.97235 13.5 3.30078 12.8284 3.30078 12Z"
          fill="#fff"
        />
      </Svg>
    </View>
  );
};

export default Icon;
