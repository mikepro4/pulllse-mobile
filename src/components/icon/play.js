import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View
      style={{ width: 22, height: 22, position: "relative", left: 6, top: 2 }}
    >
      <Svg width="14" fill="none" height="17" viewBox="0 0 14 17">
        <Path
          fill="#000"
          d="M0 16.13V.907A.5.5 0 01.768.485l12.536 7.942a.5.5 0 01-.017.855L.752 16.562A.5.5 0 010 16.13z"
        />
      </Svg>
    </View>
  );
};

export default Icon;
