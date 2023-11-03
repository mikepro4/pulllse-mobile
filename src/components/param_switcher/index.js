import Theme from "../../styles/theme";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../../components/icon"

import CustomText from "../text";

const ParamSwitcher = ({ params, onParamChange, initialValue}) => {
  const [activeParam, setActiveTab] = useState(initialValue || 0);

  const param = (item, index) => {

    let iconFill

    if( activeParam === item.id ) {
        iconFill = "black"
    } else {
        iconFill = "white"
    }

    let fontColor

    if( activeParam === item.id ) {
        fontColor = "black"
    } else {
        fontColor = "white"
    }

    let styleContainer = styles.paramContainer;

    
  
    if (index === 0) { // First item
        styleContainer = { ...styles.paramContainer, marginLeft: 0 };
    } else if (index === params.length - 1) { // Last item
        styleContainer = { ...styles.paramContainer, marginRight: 0 };
    }

   
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={index}
        style={[styleContainer, activeParam === item.id ? {backgroundColor: "rgba(255, 255, 255, 1.0)"} : {}]}
        onPress={() => {
            setActiveTab(index);
            onParamChange(item);
        }}
      >
        <Icon name={item.icon} style={{fill: iconFill}} />
        <CustomText style={[styles.paramTitle, { color: fontColor}]}>
          {item.title}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.paramGroup}>

      {params.map((item, index) => param(item, index))}
    </View>
  );
};

export default ParamSwitcher;

const styles = StyleSheet.create({
    paramTitle: {
        color: "white",
        fontSize: 12,
        marginTop: 5,
    },
    paramContainer: {
        flex: 1, // Added this
        justifyContent: "center", // Added this
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        margin: 5,
        paddingVertical: 15,
        borderRadius: 10,
    },
    paramGroup: {
        flex: 1, // Added this
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingVertical: 10,
        borderRadius: 10,
    }
});
