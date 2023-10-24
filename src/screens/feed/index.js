import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "../../redux/axios/userApi";

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

import CustomText from "../../components/text";
import Post from "../../components/post";
import Theme from "../../styles/theme";
import Tab from "../../components/tab";

import { resetScroll } from "../../redux/slices/tabSlice";

const FeedScreen = ({ navigation }) => {
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  
  const activeTab = useSelector((state) => state.tab);
  const feedList = useSelector((state) => state.feed.feed);
  const isMenuVisible = useSharedValue(true);
  const opacity = useSharedValue(0);
  const feedOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const showInitialAnimation = () => {
    opacity.value = withDelay(
      100,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
      })
    );

    feedOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 1200,
        easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
      })
    );
  };

  const fetchFeed = async () => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const response = await userApi.post(`/feed/fetchFeed`, {
        userId,
        page
      });
      setData(prevData => [...prevData, ...response.data]);
      setPage(prevPage => prevPage + 1);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  useEffect(() => {
    showInitialAnimation();
    setInitialAnimation(false);
    // dispatch(fetchFeed());
    fetchFeed()
  }, []);

  useEffect(() => {
    if (activeTab.player) {
      opacity.value = 0;
      feedOpacity.value = 0;
      setInitialAnimation(true);
    } else {
      showInitialAnimation();
    }
  }, [activeTab]);

  let playHaptics = true;
  let isReloading = false;
  let triggeredValue = null;

  const runReload = () => {
    if (!isReloading) {
      isReloading = true;

      console.log("reload", new Date());
      fetchFeed()

      setTimeout(() => {
        isReloading = false;
        playHaptics = true;
      }, 3000);
    }
  };

  const doHaptics = (value) => {
    if (value <= -100) {
      if (!isReloading) {
        runReload();

        if (playHaptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          playHaptics = false;
        }
      }
    } else {
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (opacity.value <= 0) {
        isMenuVisible.value = false;
      } else {
        isMenuVisible.value = true;
      }

      runOnJS(doHaptics)(event.contentOffset.y);
    },
  });

  const getAnimatedTabStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacity.value - scrollY.value / 100,
      };
    });
  };

  const getAnimatedFeedStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: feedOpacity.value,
      };
    });
  };

  const tabs = [
    {
      title: "For you",
    },
    {
      title: "Featured",
    },
    {
      title: "Abyss",
    },
  ];

  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const toggleScrolling = (enabled) => {
    setIsScrollEnabled(enabled);
  };

  useEffect(() => {
    if (activeTab.resetScroll) {
      scrollToTop();
      dispatch(resetScroll(false));
    }

    toggleScrolling(!activeTab.stopScroll);
  }, [activeTab]);

  const renderTab = () => {
    if (isMenuVisible.value) {
      return (
        <Animated.View style={[styles.tabContainer, getAnimatedTabStyle()]}>
          <Tab tabs={tabs} onTabChange={(position) => console.log(position)} />
        </Animated.View>
      );
    }
  };

  return (
    <View style={{ backgroundColor: "black"}}>
      {renderTab()}
      {/* <Animated.ScrollView
        style={[styles.content, getAnimatedFeedStyle()]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={scrollRef}
        scrollEnabled={isScrollEnabled}
      > */}
        {/* {feedList.map((post, index) => (
          <Post key={index} post={post} />
        ))} */}

        <Animated.FlatList
          data={data}
          style={[styles.content, getAnimatedFeedStyle()]}
          // keyExtractor={(item) => item._id.toString()}
          renderItem={({ item, index }) => (
            <Post key={item._id} post={item} />
          )}
          onScroll={scrollHandler}
          onEndReached={fetchFeed}
          onEndReachedThreshold={0.5}
          initialNumToRender={2}
          contentContainerStyle={{ paddingBottom: 500 }}
        />
      {/* </Animated.ScrollView> */}
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    top: 125,
    flex: 1,
    left: -8,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  content: {
    paddingTop: 185,
    zIndex: 1,
    // flex: 1,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0
  },
});
