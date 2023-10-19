import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import UsersList from "../../components/UsersList";
import userApi from "../../redux/axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

const UserListScreen = ({ route, navigation }) => {
  const [results, setResults] = useState();
  const { listType, userId } = route.params;

  const { _id } = useSelector((state) => state.user.userInfo);

  const fetchData = async (id) => {
    try {
      const response = await userApi.get(`/${listType}`, {
        params: { userId: id, loggedInUserId: _id },
      });

      setResults(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(userId);
  }, [userId]);

  return (
    <View>
      <Text>{listType}</Text>

      <UsersList results={results} setResults={setResults} />
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({});
