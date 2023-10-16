import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { followUser, unfollowUser } from "../redux";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const UsersList = ({ results, setResults }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const handleUnfollow = async (userId) => {
    await dispatch(unfollowUser(userId));
    const updatedResults = results.map((result) =>
      result._id === userId ? { ...result, isFollowing: false } : result
    );
    await setResults(updatedResults);
  };

  const handleFollow = async (userId) => {
    await dispatch(followUser(userId));
    const updatedResults = results.map((result) =>
      result._id === userId ? { ...result, isFollowing: true } : result
    );
    await setResults(updatedResults);
  };

  return (
    <FlatList
      style={styles.list}
      data={results}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigate("UserProfileScreen")}>
          <View style={styles.userElement}>
            <View style={styles.imageContainer}>
              {item.imageLink ? (
                <Image
                  source={{ uri: item.imageLink }}
                  style={{ width: 30, height: 30, borderRadius: 1000 }}
                />
              ) : null}
              <Text style={styles.itemText}>{item.userName}</Text>
            </View>
            {item.isFollowing ? (
              <Button
                title="Unfollow"
                onPress={() => handleUnfollow(item._id)}
              />
            ) : (
              <Button title="Follow" onPress={() => handleFollow(item._id)} />
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default UsersList;

const styles = StyleSheet.create({
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    marginTop: 20,
    height: "100%",
  },
  userElement: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
});
