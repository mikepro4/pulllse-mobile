import {
  StyleSheet,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import List from "../../components/list"

import Tab from "../../components/tab";

const FeedScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [initialAnimation, setInitialAnimation] = useState(true);
  const activeTab = useSelector((state) => state.tab);
  const isMenuVisible = useSharedValue(true);
  const opacity = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const showInitialAnimation = () => {
    opacity.value = withDelay(
      100,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
      })
    );
  };

  useEffect(() => {
    showInitialAnimation();
    setInitialAnimation(false);
  }, []);

  useEffect(() => {
    if (activeTab.player) {
      opacity.value = 0;
      setInitialAnimation(true);
    } else {
      showInitialAnimation();
    }
  }, [activeTab]);


  const getAnimatedTabStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacity.value - scrollY.value / 100,
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
    <View style={{ backgroundColor: "black" }}>
      {renderTab()}
      <List
        url="/feed/fetchFeed"
        limit={2}
        listItem="pulse"
        onScrollEvent={(value) => {
          if (!activeTab.player) {
            scrollY.value = value;
            if (opacity.value <= 0) {
              isMenuVisible.value = false;
            } else {
              isMenuVisible.value = true;
            }
          }
        }}
      />
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
  },
});
