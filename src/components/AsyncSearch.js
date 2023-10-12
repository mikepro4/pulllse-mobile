import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import userApi from "../redux/axios/userApi";
import throttle from "lodash/throttle";
const AsyncSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  console.log("results", results);

  const throttledSearch = useCallback(
    throttle(async (searchQuery) => {
      try {
        let response = await userApi(`/searchUser?q=${searchQuery}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error searching: ", error);
      }
    }, 500),
    []
  );

  const fetchInitialProfiles = async () => {
    try {
      let response = await userApi.get(`/searchUser/fetchInitialProfiles`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching initial profiles: ", error);
    }
  };

  const handleTextChange = (text) => {
    setQuery(text);
    throttledSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleTextChange}
        placeholder="Search products..."
        onFocus={fetchInitialProfiles}
      />
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          console.log("item", item),
          (<Text style={styles.itemText}>{item.userName}</Text>)
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#f9f9f9", // A light gray background
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff", // white background
  },
  button: {
    marginBottom: 10,
  },
  list: {
    marginTop: 20,
    height: 100,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AsyncSearch;
