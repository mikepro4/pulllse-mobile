import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
import styles from "./indexStyle";

const Icon = (props) => {
  return (
    <View style={{width: 22, height: 22, position: "relative", left: 2, top: 2}}>
      <Svg width="18" fill="none" height="17" viewBox="0 0 18 17">
          <Path
            fill={props.style.fill}
            fillRule="evenodd"
            d="M16.74.346a1 1 0 01.376.781v11.019c0 .808-.276 1.59-.78 2.225a3.728 3.728 0 01-1.987 1.287 3.806 3.806 0 01-2.37-.15 3.696 3.696 0 01-1.801-1.533 3.565 3.565 0 01-.474-2.309 3.604 3.604 0 011.07-2.103 3.757 3.757 0 012.138-1.022 3.8 3.8 0 012.204.381V2.378L8.015 3.98V13.038c0 .809-.277 1.59-.78 2.225a3.728 3.728 0 01-1.987 1.288 3.806 3.806 0 01-2.37-.151 3.697 3.697 0 01-1.802-1.533 3.565 3.565 0 01-.473-2.309 3.604 3.604 0 011.07-2.102A3.757 3.757 0 013.81 9.433a3.8 3.8 0 012.204.382V3.98a2 2 0 011.56-1.95l8.32-1.878a1 1 0 01.845.194zM6.015 12.347a3.677 3.677 0 00-.34-.338 4.86 4.86 0 00-.334-.269c-.083-.06-.12-.082-.12-.083l.022.01a.976.976 0 01-.077-.039 1.798 1.798 0 00-1.102-.211 1.757 1.757 0 00-1 .476 1.604 1.604 0 00-.479.935c-.047.349.025.705.21 1.014.184.31.474.56.828.701.355.143.75.168 1.123.072.372-.097.695-.308.922-.595.227-.285.346-.63.347-.982v-.69zm9.1-.892l-.023-.028a3.678 3.678 0 00-.316-.31c-.12-.105-.238-.2-.334-.27-.082-.06-.12-.081-.12-.082l.015.007a.979.979 0 01-.07-.036 1.797 1.797 0 00-1.102-.211 1.757 1.757 0 00-1 .475 1.604 1.604 0 00-.479.936c-.047.349.025.705.21 1.014.184.31.474.56.828.701.355.143.75.168 1.123.071.372-.096.695-.307.922-.594a1.58 1.58 0 00.347-.982v-.691z"
            clipRule="evenodd"
          />
      </Svg>
  </View>
  );
};

export default Icon;
