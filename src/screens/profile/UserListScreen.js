import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import UsersList from "../../components/user_list";
import userApi from "../../redux/axios/userApi";
import { useSelector } from "react-redux";

const UserListScreen = ({ route }) => {
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
