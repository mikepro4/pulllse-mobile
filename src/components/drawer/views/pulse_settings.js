import { StyleSheet, View, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Form, Field, FormSpy } from 'react-final-form';
import Input from '../../../components/form/Input';
import CustomText from "../../../components/text";
import Button from "../../../components/button"

import { setPulseTitle, setPulseAudioSourceType } from "../../../redux";

import ParamSwitcher from "../../param_switcher";
import AudioSourceEditor from "../../audio_source_editor";

const PulseSettings = () => {
    const dispatch = useDispatch();
    const player = useSelector((state) => state.player);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef(null);
    const [audioSource, setAudioSource] = useState(1)

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

    let audioSourceTypes = [
        {
            id: 0,
            title: "Recording",
            value: "recording",
            icon: "mic",
        },
        {
            id: 1,
            title: "Spotify",
            value: "spotify",
            icon: "spotify",
        },
        {
            id: 2,
            title: "Sound file",
            value: "file",
            icon: "music",
        }
    ]

    const getSourceTypeId = (value) => {
        const sourceType = audioSourceTypes.find(source => source.value === value);
        return sourceType ? sourceType.id : null;
    }   


    return (
        <View style={{ position: "relative", flex: 1 }}>
            <ScrollView style={styles.drawerContainer} ref={scrollViewRef}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{ pulse_name: player.editedPulse?.title }}
                    render={({ handleSubmit }) => (
                        <View>

                            {/* <FormSpy
                                onChange={formState => {
                                    dispatch(setPulseTitle(formState.values.pulse_name))
                                }}
                            /> */}

                            <Field
                                name="pulse_name"
                                label="Pulse name"
                                component={Input}
                                placeholder="Untitled..."
                                validate={validateName}
                                onChange={(value) => {
                                    setEmail(value.nativeEvent.text)
                                    dispatch(setPulseTitle(value.nativeEvent.text))
                                }}
                            />

                        </View>
                    )}
                />

                <View style={{ paddingVertical: 5 }} >
                    <ParamSwitcher
                        initialValue={getSourceTypeId(player.editedPulse?.audioSourceType)}
                        params={audioSourceTypes}
                        onParamChange={(param) => {
                            console.log(param)

                            dispatch(setPulseAudioSourceType(param.value))

                        }}
                    />

                <AudioSourceEditor/>

                </View>



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
