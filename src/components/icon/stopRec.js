import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View style={{ width: 24, height: 24, position: "relative" }}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          fill="#000"
          d="M2.40039 6.00002C2.40039 4.0118 4.01217 2.40002 6.00039 2.40002H18.0004C19.9886 2.40002 21.6004 4.0118 21.6004 6.00002V18C21.6004 19.9882 19.9886 21.6 18.0004 21.6H6.00039C4.01217 21.6 2.40039 19.9882 2.40039 18V6.00002Z"
        />
      </Svg>
    </View>
  );
};

export default Icon;
