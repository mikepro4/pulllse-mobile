import { StyleSheet, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signout } from "../redux";
import { useDispatch } from "react-redux";
import React from "react";
import { useSelector } from "react-redux";

const WallScreen = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View>
        <Text>WallScreen</Text>
        <Button
          title="Sign Out"
          onPress={() => {
            dispatch(signout());
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default WallScreen;

const styles = StyleSheet.create({});
