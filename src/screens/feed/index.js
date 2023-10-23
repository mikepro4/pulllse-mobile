import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomText from "../../components/text";
import Post from "../../components/post";
import Theme from "../../styles/theme";
import Tab from "../../components/tab";


import CustomText from "../../components/text"
import Post from "../../components/post"
import Theme from "../../styles/theme"
import Tab from "../../components/tab"

import { resetScroll } from '../../redux/slices/tabSlice'

const FeedScreen = ({ navigation }) => {
  const [initialAnimation, setInitialAnimation] = useState(true);
  const activeTab = useSelector((state) => state.tab);
  const isMenuVisible = useSharedValue(true);
  const opacity = useSharedValue(0);
  const feedOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const dispatch = useDispatch();

  const showInitialAnimation = () => {
    opacity.value = withDelay(100, withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
    }))
    feedOpacity.value = withDelay(300, withTiming(1, {
      duration: 1200,
      easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
    }))
  };

  useEffect(() => {
    showInitialAnimation()
    setInitialAnimation(false)
  }, [])

  useEffect(() => {
    if(activeTab.player) {
      opacity.value = 0;
      feedOpacity.value = 0;
      setInitialAnimation(true)
    } else {
      showInitialAnimation()
    }
  }, [activeTab])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      // console.log(scrollY.value)
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

  useEffect(() => {
    if(activeTab.resetScroll) {
      scrollToTop()
      dispatch(
        resetScroll(false)
    );
    }
  }, [activeTab])

  return (
    <View style={{ backgroundColor: "black" }}>
      {isMenuVisible.value && (
        <Animated.View style={[styles.tabContainer, getAnimatedTabStyle()]}>
          <Tab tabs={tabs} onTabChange={(position) => console.log(position)} />
        </Animated.View>
      )}

      <Animated.ScrollView
        style={[styles.content, getAnimatedFeedStyle() ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={scrollRef}
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
    zIndex: 2,
  },
  content: {
    paddingTop: 185,
    zIndex: 1,
  },
});
