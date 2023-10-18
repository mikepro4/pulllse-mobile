import { StyleSheet, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/icon"
import FeedScreen from "./feed";
import AppTabBar from "../components/app_tab_bar";
import Header from "../components/header";
import CustomText from "../components/text";
import Player from "../screens/player"


const MainFlow = () => {
    const activeTab = useSelector(state => state.tab);
    const activePlayer = useSelector(state => state.tab.player);

    let renderedScreen;

    const renderPlayer = () => {
        if(activePlayer) {
            return (
                <Player/>
            )
        }
    }

    switch (activeTab.name) {
        case 'feed':
            renderedScreen = <FeedScreen />;
            break;
        case 'x':
            renderedScreen = <CustomText>Profile</CustomText>
            break;
        case 'search':
            renderedScreen = <CustomText>Search</CustomText>
            break;
        case 'profile':
            renderedScreen = <CustomText>Profile</CustomText>
            break;
        default:
            renderedScreen = <FeedScreen />;
            break;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000000'}}>
            <Header/>
            {renderPlayer()}
            {renderedScreen}
            <AppTabBar />
        </View>
    );
};

export default MainFlow;

const styles = StyleSheet.create({
    playerContainer: {
        position: "absolute",
        flex: 1,
        zIndex: 2,
        backgroundColor: "#000000",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});
