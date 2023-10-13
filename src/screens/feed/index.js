import { StyleSheet, View, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../../components/text"
import Post from "../../components/post"

const FeedScreen = () => {
  return (
    <ScrollView style={styles.content}>
      {Array.from({ length: 50 }).map((_, index) => (
        <Post key={index}/>
      ))}
    </ScrollView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  content: {
    paddingTop: 60,
    zIndex: 1,
  },
});
