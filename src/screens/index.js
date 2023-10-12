import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/icon"
import FeedScreen from "./feed";
import AppTabBar from "../components/app_tab_bar";
import Header from "../components/header";

const MainFlow = () => {
    const activeTab = useSelector(state => state.tab);

    let renderedScreen;

    switch (activeTab.name) {
        case 'feed':
            renderedScreen = <FeedScreen />;
            break;
        case 'x':
            renderedScreen = <Text>Profile</Text>
            break;
        case 'player':
            renderedScreen = <Text>Player</Text>
            break;
        case 'search':
            renderedScreen = <Text>Search</Text>
            break;
        case 'profile':
            renderedScreen = <Text>Profile</Text>
            break;
        default:
            renderedScreen = <FeedScreen />;
            break;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <Header/>
            {renderedScreen}
            <AppTabBar />
        </SafeAreaView>
    );
};

export default MainFlow;

const styles = StyleSheet.create({});
