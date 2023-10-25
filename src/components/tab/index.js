import Theme from "../../styles/theme";
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const Tab = ({ navigation, tabs, onTabChange }) => {
  const [previousTab, setPreviousTab] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const opacity = useSharedValue(1);

  const getAnimatedTabStyle = () => {
    return useAnimatedStyle(() => {
      return {
        opacity: opacity.value - scrollY.value / 100,
      };
    });
  };

  const getAnimatedTextStyle = (tab) => {
    return useAnimatedStyle(() => {
      return {
        opacity:
          activeTab == tab
            ? withTiming(1, { duration: 1000, easing: Theme.easing1 })
            : withTiming(0.5, { duration: 1000, easing: Theme.easing1 }),
      };
    });
  };

  const getLineAnimatedStyle = (tab) => {
    let position = -100;
    let tabType;
    let opacity;

    if (tab == previousTab) {
      tabType = "previous";
    } else if (tab == activeTab) {
      tabType = "current";
    } else {
      tabType = "unused";
    }

    if (tabType == "previous" || tabType == "current") {
      if (tabType == "previous") {
        if (activeTab > previousTab) {
          position = 100;
          opacity = 1;
        } else {
          position = -100;
          opacity = 1;
        }
      }

      if (tabType == "current") {
        if (activeTab > previousTab) {
          position = 0;
          opacity = 1;
        } else {
          position = 0;
          opacity = 1;
        }
      }
    }

    if (tabType == "unused") {
      opacity = 0;
      if (!previousTab) {
        position = -100;
      } else {
        if (tab < activeTab) {
          position = 100;
        } else {
          position = -100;
        }
      }
    }

    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withTiming(position, {
              duration: 500,
              easing: Theme.easing1,
            }),
          },
        ],
        opacity: opacity,
      };
    });
  };

  const tab = (position, title) => {
    return (
      <TouchableOpacity
        activeOpacity={position}
        style={[styles.tabTextContainer]}
        key={position}
        onPress={() => {
          if (activeTab !== position) {
            setPreviousTab(activeTab);
            setActiveTab(position);
            onTabChange(position);
          }
        }}
      >
        <Animated.Text style={[styles.tabText, getAnimatedTextStyle(position)]}>
          {title}
        </Animated.Text>
        <View style={styles.lineContainer}>
          <Animated.View
            style={[styles.line, getLineAnimatedStyle(position)]}
          ></Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabGroup}>
      {/* {tab(1, "For you")}

        {tab(2, "Featured")}

        {tab(3, "Abyss")} */}

      {tabs.map((item, index) => tab(index + 1, item.title))}
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({
  lineContainer: {
    position: "absolute",
    left: 0,
    bottom: -5,
    right: 0,
    height: 1,
    // backgroundColor: "red",
    flex: 1,
    overflow: "hidden",
  },
  line: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: -0,
    right: 0,
    height: 1,
    backgroundColor: "white",
  },
  activeTabClass: {
    opacity: 1,
  },
  tabTextContainer: {
    marginHorizontal: 15,
    position: "relative",
    overflow: "visible",
  },
  tabGroup: {
    flex: 1,
    flexDirection: "row",
  },
  tabText: {
    fontSize: 16,
    opacity: 0.5,
    color: "#ffffff",
    fontFamily: "aeonik-regular",
  },
});
