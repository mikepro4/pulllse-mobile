import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomText from '../../../../components/text';

const Ethereal = ({ preview, layer }) => {

    let size 

    if (preview) {
        size = 100
    } else {
        size = 200
    }
    return (
        <View style={styles.container}>
            <View style={{ width: size, height: size, backgroundColor: "#333", borderRadius: 100}}>
                <CustomText>
                    {layer.position}
                </CustomText>
            </View>
        </View>
    );
};

export default Ethereal;

const styles = StyleSheet.create({
    container: {
      position: "absolute",
      flex: 1,
    //   zIndex: 1000,
    //   backgroundColor: "red",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
    },
})  
