import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import FollowUnfollowButton from "../follow_unfollow_button";

const UsersList = ({ results, setResults }) => {
  const navigation = useNavigation();
  const storedUserInfo = useSelector((state) => state.user.userInfo);

  return (
    <>
      {results ? (
        <FlatList
          style={styles.list}
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                storedUserInfo._id !== item._id
                  ? navigation.push("UserProfileScreen", {
                      id: item._id,
                      item,
                    })
                  : navigation.dispatch(StackActions.popToTop());
              }}
            >
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
                {storedUserInfo._id !== item._id ? (
                  <FollowUnfollowButton
                    item={item}
                    results={results}
                    setResults={setResults}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Nothing to fetch</Text>
      )}
    </>
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
