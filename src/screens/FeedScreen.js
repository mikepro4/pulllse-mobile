import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAudios, deleteAudio } from "../redux";
import Icon from "../components/icon"

const FeedScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}} barStyle="light-content">
      <Icon name="search" />

      <View style={{ backgroundColor: 'transparent'}}>
        <Text>FeedScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
