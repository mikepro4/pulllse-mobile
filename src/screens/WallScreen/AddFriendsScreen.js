import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import AsyncSearch from "../../components/AsyncSearch";

const AddFriendsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>AddFriendsScreen</Text>
      <AsyncSearch />
    </View>
  );
};

export default AddFriendsScreen;

const styles = StyleSheet.create({});
