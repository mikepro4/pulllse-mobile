import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View style={{ width: 24, height: 24, position: "relative" }}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          fill={props.style.color}
          d="M7.20039 21.5999H16.8004C18.1259 21.5999 19.2004 20.5254 19.2004 19.1999V7.1999H20.4004C21.0631 7.1999 21.6004 6.66264 21.6004 5.9999C21.6004 5.33716 21.0631 4.7999 20.4004 4.7999H17.2129L16.2418 3.02413C16.0313 2.63926 15.6276 2.3999 15.1889 2.3999H8.96959C8.451 2.3999 7.99196 2.73384 7.78559 3.2096C7.57554 3.69386 7.26942 4.30852 6.89498 4.7999H3.60039C2.93765 4.7999 2.40039 5.33716 2.40039 5.9999C2.40039 6.66264 2.93765 7.1999 3.60039 7.1999H4.80039V19.1999C4.80039 20.5254 5.87491 21.5999 7.20039 21.5999ZM9.60039 9.5999C10.2631 9.5999 10.8004 10.1372 10.8004 10.7999V16.7999C10.8004 17.4626 10.2631 17.9999 9.60039 17.9999C8.93765 17.9999 8.40039 17.4626 8.40039 16.7999V10.7999C8.40039 10.1372 8.93765 9.5999 9.60039 9.5999ZM14.4004 9.5999C15.0631 9.5999 15.6004 10.1372 15.6004 10.7999V16.7999C15.6004 17.4626 15.0631 17.9999 14.4004 17.9999C13.7376 17.9999 13.2004 17.4626 13.2004 16.7999V10.7999C13.2004 10.1372 13.7376 9.5999 14.4004 9.5999Z"
        />
      </Svg>
    </View>
  );
};

export default Icon;