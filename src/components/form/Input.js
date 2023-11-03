import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import CustomText from "../text";

const Input = ({ label, placeholder, input, meta, ...inputProps }) => {
    const [isFocused, setIsFocused] = useState(false);

    const [charCount, setCharCount] = useState(0);

    const handleFocus = () => {
        setIsFocused(true);
      };
    
    const handleBlur = () => {
        setIsFocused(false);
    }; 

    useEffect(() => {   
        setCharCount(input.value);
    }, []);
    
    return (
       
        <View style={[styles.inputContainer, isFocused && styles.activeBorder, meta.touched && meta.invalid && styles.errorBorder ]}>
            {(charCount > 0 || input.value.length > 0) && <CustomText style={styles.smallPlaceholder}>{label}</CustomText> }
            <View style={styles.realInputContainer}>
                <TextInput
                    autoCompleteType="off"
                    autoCorrect={false}
                    spellCheck={false}
                    onChangeText={text => {
                        input.onChange(text);
                        setCharCount(text.length);
                    }}
                    style={styles.input}
                    placeholderTextColor="rgba(255,255,255,00)"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={input.value}
                    {...inputProps}
                />
            </View>
           
            {charCount == 0  && <View style={styles.placeholderTextContainer}>
                <CustomText style={styles.placeholderText}>{placeholder}</CustomText>
            </View>}
            {/* <CustomText>{meta.valid ? "valid": "invalid"}</CustomText> */}
            {meta.touched && meta.error && (
                <Text style={styles.errorLabel}>{meta.error}</Text>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
  
    placeholderTextContainer: {
        position: "absolute",
        zIndex: 1,
        top: 15,
    },

    placeholderText: {
        fontSize: 22,
        fontFamily: "aeonik-light",
        color: "rgba(255,255,255,0.2)",
    },
    realInputContainer: {
        position: "relative",
        zIndex: 2
    },
    smallPlaceholder: {
        fontSize: 11,
        fontFamily: "aeonik-light",
        position: "absolute",
        top: 0,
        left: -1,
        opacity: 0.4
    },
    inputContainer: { 
        position: "relative",
        height: 54,
        paddingTop: 10,
        // backgroundColor: "red",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.2)"
    },
    activeBorder: {
        borderBottomColor: "rgba(255,255,255,1)"
    },
    errorBorder: {
        borderBottomColor: "rgba(241,0,0,1)"
    },
    input: {
        height: 40, 
        borderColor: 'transparent', 
        borderWidth: 1,
        color: "white",
        fontFamily: "aeonik-regular",
        fontSize: 20,
        position: "relative",
    },
    errorLabel: {
        position: "absolute",
        bottom: -15,
        left: 0,
        fontFamily: "aeonik-light",
        color: "red",
        fontSize: 11
    }
})

export default Input;