import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { switchTab } from '../../redux/slices/tabSlice';
import Icon from '../icon'

const AppTabBar = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();

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
    <View style={styles.tabBar}>

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
        onPress={() => dispatch(switchTab({
          name: 'player',
          icon: 'plus'
        }))}
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

    </View>
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
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20
  }
});

export default AppTabBar;