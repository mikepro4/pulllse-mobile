import { Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomText = (props) => {
    return (
        <Text
            style={[{ color: 'white' }, props.style]}>
            {props.children}
        </Text>
    );
};

export default CustomText;

const styles = StyleSheet.create({});
