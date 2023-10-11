import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAudios, deleteAudio } from "../redux";

const FeedScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>FeedScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
