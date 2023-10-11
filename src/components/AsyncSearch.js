import React, { useState, useCallback } from "react";
import { View, TextInput, FlatList, Text, Button } from "react-native";
import userApi from "../axios/userApi";
import throttle from "lodash/throttle";

const AsyncSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const throttledSearch = useCallback(
    throttle(async (searchQuery) => {
      try {
        let response = await userApi(`/search?q=${searchQuery}`);
        let data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error searching: ", error);
      }
    }, 500),
    []
  );

  const handleSearch = () => {
    throttledSearch(query);
  };
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default AsyncSearch;
