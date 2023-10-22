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
import Tab from "../../components/tab"


const FeedScreen = ({ navigation }) => {
  const isMenuVisible = useSharedValue(true);
  const opacity = useSharedValue(1);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      console.log(scrollY.value)
      if (opacity.value <= 0) {
        isMenuVisible.value = false;
      } else {
        isMenuVisible.value = true;
      }
    },
  });

  const getAnimatedTabStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacity.value - scrollY.value / 100,
      };
    });
  };

  const tabs = [
    {
      title: "For you"
    },
    {
      title: "Featured"
    },
    {
      title: "Abyss"
    }
  ]


  return (
    <View style={{ backgroundColor: "black" }}>

      {isMenuVisible.value && <Animated.View style={[styles.tabContainer, getAnimatedTabStyle()]}>
        <Tab tabs={tabs} onTabChange={(position) => console.log(position)} />

      </Animated.View>}

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
  tabContainer: {
    position: "absolute",
    top: 120,
    flex: 1,
    left: -8,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  content: {
    paddingTop: 185,
    zIndex: 1,
  }
});
