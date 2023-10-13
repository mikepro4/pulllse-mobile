import { StyleSheet, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Icon from "../icon"
import Logo from "../icon/logo"

const Header = () => {

    return (
        <View style={styles.container}>
            <View>
                <Icon name="lll"/>
            </View>

            <View>
                <Logo />
            </View>

            <View>
                <Icon name="notification"/>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flex: 1
    }
});
