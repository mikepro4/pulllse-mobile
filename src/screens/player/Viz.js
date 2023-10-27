import React from 'react';
import { View, Text , StyleSheet} from 'react-native';
import CustomText from "../../components/text";
import Algorithms from './algorithms';

const Viz = ({ preview, layers }) => {
    return (
        <View style={styles.container}>
            {layers.map((layer, index) => {
                return (
                    <Algorithms key={index} layer={layer} preview={preview}/>
                )
            })}
        </View>
    );
};

export default Viz;

const styles = StyleSheet.create({
    container: {
      position: "absolute",
      flex: 1,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
    },
})  
