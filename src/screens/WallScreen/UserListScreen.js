import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import UsersList from "../../components/UsersList";
import userApi from "../../redux/axios/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserListScreen = ({ route, navigation }) => {
  const [results, setResults] = useState();
  const { listType } = route.params;

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      // Fetching data using GET request with userId as a query parameter
      const response = await userApi.get(`/${listType}`, {
        params: { userId },
      });
      console.log("response.data", response.data);
      // Directly setting the results since axios automatically parses JSON
      setResults(response.data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Text>UserListScreen</Text>
      <UsersList results={results} setResults={setResults} />
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({});
