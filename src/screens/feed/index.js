import { StyleSheet, View, ScrollView, Button, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useDerivedValue,
  useAnimatedScrollHandler,
  withSpring, 
  withTiming,
} from 'react-native-reanimated';

import CustomText from "../../components/text"
import Post from "../../components/post"
import Theme from "../../styles/theme"

const FeedScreen = () => {
  const activeTab = useSharedValue(1);
  const isMenuVisible = useSharedValue(true);
  const opacity = useSharedValue(1);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if(opacity.value <= 0) {
        isMenuVisible.value = false;
      } else {
        isMenuVisible.value = true;
      }
      // if (scrollY.value > lastScrollY.value) {
      //   // Scrolling down
      //   isMenuVisible.value = false;
      // } else {
      //   // Scrolling up
      //   isMenuVisible.value = true;
      // }
      // lastScrollY.value = scrollY.value;
    },
  });

  const getAnimatedTabStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacity.value - scrollY.value / 100,
      };
    });
  };

  const getAnimatedStyle = (tab) => {
    return useAnimatedStyle(() => {
      return {
        opacity: activeTab.value === tab 
          ? withTiming(1, { duration: 1000, easing: Theme.easing1 }) 
          : withTiming(0.5, { duration: 1000, easing: Theme.easing1 })
      };
    });
  };

  return (
    <View>

      {isMenuVisible.value && <Animated.View style={[styles.tabContainer, getAnimatedTabStyle()]}>
        <View style={styles.tabGroup}>

          <TouchableOpacity
            activeOpacity={1}
            style={[styles.tabTextContainer]}
            onPress={() => activeTab.value = 1}
          >
            <Animated.Text style={[styles.tabText, getAnimatedStyle(1)]}>For you</Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={[styles.tabTextContainer]}
            onPress={() => activeTab.value = 2}
          >
            <Animated.Text style={[styles.tabText, getAnimatedStyle(2)]}>Featured</Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={[styles.tabTextContainer]}
            onPress={() => activeTab.value = 3}
          >
            <Animated.Text style={[styles.tabText, getAnimatedStyle(3)]}>Abyss</Animated.Text>
          </TouchableOpacity>

        </View>

      </Animated.View> }

      <Animated.ScrollView 
        style={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <Post key={index} />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  activeTabClass: {
    opacity: 1
  },
  tabTextContainer: {
    marginHorizontal: 15
  },
  tabGroup: {
    flex: 1,
    flexDirection: "row"
  },
  tabText: {
    fontSize: 16,
    opacity: 0.5,
    color: "#fff",
    fontFamily: "aeonik-regular"
  },
  tabContainer: {
    position: "absolute",
    top: 65,
    flex: 1,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  content: {
    paddingTop: 130,
    zIndex: 1,
  },
});
