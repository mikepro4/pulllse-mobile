import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View style={{ marginLeft: props.style.marginLeft }}>
      <Svg
        fill="none"
        width={props.style.width}
        height={props.style.height}
        viewBox="0 0 24 24"
      >
        <Path
          fill={props.style.color}
          d="M18.1447 10.8665C19.5502 11.6788 19.5554 12.7006 18.1447 13.6189L7.24495 21.2422C5.87541 22.0001 4.94525 21.5526 4.84761 19.9126L4.80136 3.95717C4.77053 2.44647 5.97048 2.01965 7.1139 2.74396L18.1447 10.8665Z"
        />
      </Svg>
    </View>
  );
};

export default Icon;
