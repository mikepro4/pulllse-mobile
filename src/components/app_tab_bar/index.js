import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { switchTab, togglePlayer } from '../../redux/slices/tabSlice';
import Icon from '../icon'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

import Theme from "../../styles/theme"

const AppTabBar = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animateOut = () => {
    offset.value = withSpring(85, {
      mass: 1,
      damping: 57,
      stiffness: 450,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value= withTiming(0, {
      duration: 150,
      easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
    })
  };

  // Animate tab bar back in when "plus" is deselected
  const animateIn = () => {
    offset.value = withSpring(0, {
      mass: 1,
      damping: 57,
      stiffness: 450,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value= withTiming(1, {
      duration: 150,
      easing: Easing.bezier(0.18, 0.26, 0.04, 1.06),
    })
  };

  useEffect(() => {
    if (activeTab.player) {
      animateOut();
    } else {
      animateIn();
    }
  }, [activeTab]); // Re-run effect when activeTab changes

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: opacity.value
  }));


  const Button = ({ content, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.button}
        activeOpacity={1}
        onPress={() => onPress()}
        >
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View style={[styles.tabBar, animatedStyles]}>

      <Button
        content={<Icon name="mountains" style={{ fill: activeTab.name === 'feed' ? '#fff' : 'transparent' }} />}
        onPress={() => dispatch(switchTab({
          name: 'feed',
          icon: 'mountains'
        }))}
      />

      <Button
        content={<Icon name="x" style={{ strokeWidth: activeTab.name === 'x' ? '2' : '1' }} />}
        onPress={() => dispatch(switchTab({
          name: 'x',
          icon: 'mountains'
        }))}
      />

      <Button
        content={<Icon name="plus" style={{ strokeWidth: activeTab.name === 'player' ? '2' : '1' }} />}
        onPress={() => dispatch(togglePlayer(true))}
      />

      <Button
        content={<Icon name="search" style={{ strokeWidth: activeTab.name === 'search' ? '2' : '1' }} />}
        onPress={() => dispatch(switchTab({
          name: 'search',
          icon: 'search'
        }))}
      />

      <Button
        content={<Icon name="user" style={{ fill: activeTab.name === 'profile' ? '#fff' : 'transparent' }} />}
        onPress={() => dispatch(switchTab({
          name: 'profile',
          icon: 'user'
        }))}
      />

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 85,
    paddingHorizontal: 20,
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#000000'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20
  }
});

export default AppTabBar;