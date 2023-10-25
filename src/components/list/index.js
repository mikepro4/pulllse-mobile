import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { resetScroll } from "../../redux/slices/tabSlice";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useDerivedValue,
    useAnimatedScrollHandler,
    withDelay,
    withSpring,
    withTiming,
    Easing,
} from "react-native-reanimated";

import { runOnJS } from "react-native-reanimated";

import userApi from "../../redux/axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Post from "./views/Post";

let paddingTop = 185;

const List = ({ limit, url, listItem, onScrollEvent }) => {
    const [initialAnimation, setInitialAnimation] = useState(true);
    const activeTab = useSelector((state) => state.tab);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const feedOpacity = useSharedValue(0);
    const dispatch = useDispatch();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getAnimatedListStyle = () => {
        return useAnimatedStyle(() => {
            return {
                opacity: feedOpacity.value,
            };
        });
    };

    const fetchData = async () => {
        const userId = await AsyncStorage.getItem("userId");
        try {
            const response = await userApi.post(url, {
                userId,
                page,
                limit
            });
            setData(prevData => [...prevData, ...response.data]);
            setPage(prevPage => prevPage + 1);
            console.log(response.data)
        } catch (error) {
            console.error(error);
        } finally {
        }
    }


    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            runOnJS(onScrollEvent)(event.contentOffset.y)
        },
    });

    useEffect(() => {
        showInitialAnimation();
        setInitialAnimation(false);
        fetchData()
    }, []);

    const renderListItem = (item, index) => {
        return (
            <Post key={item._id} post={item} />
        )
    }

    const showInitialAnimation = () => {
        feedOpacity.value = withDelay(
            300,
            withTiming(1, {
                duration: 1200,
                easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
            })
        );
    };

    useEffect(() => {
        if (activeTab.resetScroll) {
            scrollToTop();
            dispatch(resetScroll(false));
        }
    }, [activeTab]);

    const scrollRef = useRef();

    const scrollToTop = () => {
        scrollRef.current.scrollToOffset({ y: 0, animated: true });
    };

    return (
        <Animated.FlatList
            ref={scrollRef}
            data={data}
            style={[styles.content, getAnimatedListStyle()]}
            renderItem={({ item, index }) => {
                return renderListItem(item, index);
            }}
            onScroll={scrollHandler}
            onEndReached={fetchData}
            onEndReachedThreshold={0.5}
            initialNumToRender={2}
            contentContainerStyle={{ paddingBottom: 500 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" progressViewOffset={165} />
            }
        />
    );
};

export default List;

const styles = StyleSheet.create({
    content: {
        paddingTop: 185,
        zIndex: 1,
    },
});

