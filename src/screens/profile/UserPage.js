import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { signout } from "../../redux";
import { useDispatch, useSelector } from "react-redux";

const UserPage = () => {
  const dispatch = useDispatch();
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          dispatch(signout());
        }}
      />
    </View>
  );
};

export default UserPage;

const styles = StyleSheet.create({});
