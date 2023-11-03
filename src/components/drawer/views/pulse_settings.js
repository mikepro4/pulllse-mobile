import { StyleSheet, View, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Form, Field, FormSpy } from 'react-final-form';
import Input from '../../../components/form/Input';
import Slider from '../../../components/form/Slider';
import Theme from "../../../styles/theme";
import CustomText from "../../../components/text";
import Button from "../../../components/button"

const PulseSettings = () => {
    const dispatch = useDispatch();
    const player = useSelector((state) => state.tab);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef(null);

    const onSubmit = (values) => {
        console.log(values);
    };

    const validateName = value => {
        if (!value) return "Name is required";
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (event) => {
                setKeyboardHeight(event.endCoordinates.height)
                // scrollViewRef.current.scrollTo({ x: 0, y: event.endCoordinates.height, animated: true });
                console.log("event.endCoordinates.height", event.endCoordinates.height)
            },
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardHeight(0),
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);


    return (
        <View style={{ position: "relative", flex: 1 }}>
            <ScrollView style={styles.drawerContainer} ref={scrollViewRef}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <Form
                        onSubmit={onSubmit}
                        render={({ handleSubmit }) => (
                            <View>

                                <FormSpy
                                    onChange={formState => {
                                        console.log('Form state changed!', formState.values);
                                    }}
                                />

                                <Field
                                    name="pulse_name"
                                    label="Pulse name"
                                    component={Input}
                                    placeholder="Type pulse name..."
                                    validate={validateName}
                                    onChange={(value) => setEmail(value.nativeEvent.text)}
                                    value={email}
                                />

                                <Button title="Submit" label="Submit" onPressIn={handleSubmit} />
                            </View>
                        )}
                    />

                    <View
                        style={{ height: keyboardHeight > 0 ? keyboardHeight * 2.22 : 700, width: "100%", position: "relative" }}
                    >
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>

        </View>
    );

};

export default PulseSettings;

const styles = StyleSheet.create({
    drawerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: "red",
        paddingHorizontal: 20,

    }
})
