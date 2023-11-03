import React from 'react';
import { View, Text } from 'react-native';
// import { Slider } from '@react-native-assets/slider'
import {Slider} from '@miblanchard/react-native-slider';

const CustomSlider = ({ input, onChange, label, meta, ...props }) => {
  return (
    <View style={{ padding: 10 }}>
      {label && <Text>{label}</Text>}
      <Slider
        value={input.value}
        onValueChange={value => {
            onChange(value)
            input.onChange(value); // update the form state
        }}
        {...props}
      />
      {meta.touched && meta.error && <Text style={{ color: 'red' }}>{meta.error}</Text>}
    </View>
  );
};

export default CustomSlider;