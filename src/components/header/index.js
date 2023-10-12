import { StyleSheet, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../text"
import Icon from "../icon"

const Header = () => {
    const activeTab = useSelector(state => state.tab);

    let renderedScreen;

    // switch (activeTab.name) {
    //     case 'feed':
    //         renderedScreen = <FeedScreen />;
    //         break;
    //     case 'x':
    //         renderedScreen = <Text>Profile</Text>
    //         break;
    //     case 'player':
    //         renderedScreen = <Text>Player</Text>
    //         break;
    //     case 'search':
    //         renderedScreen = <Text>Search</Text>
    //         break;
    //     case 'profile':
    //         renderedScreen = <Text>Profile</Text>
    //         break;
    //     default:
    //         renderedScreen = <FeedScreen />;
    //         break;
    // }

    return (
        <View>
            <CustomText>Header</CustomText>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({});
