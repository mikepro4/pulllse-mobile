import { StyleSheet, View, ScrollView, Button, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import CustomText from "../../components/text"
import Post from "../../components/post"

const FeedScreen = () => {
  const [feedType, setFeedType] = useState(1);

  const activeTab = useSharedValue(1);  

  const getAnimatedStyle = (tab) => {
    return useAnimatedStyle(() => {
      return {
        opacity: activeTab.value === tab ? withTiming(1, { duration: 200, easing: Easing.linear }) : 0.5
      };
    });
  };

  return (
    <View>

      <View style={styles.tabContainer}>
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

      </View>

      <ScrollView style={styles.content}>
        {Array.from({ length: 50 }).map((_, index) => (
          <Post key={index}/>
        ))}
      </ScrollView>
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
    top: 70,
    flex: 1,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  content: {
    paddingTop: 140,
    zIndex: 1,
  },
});
