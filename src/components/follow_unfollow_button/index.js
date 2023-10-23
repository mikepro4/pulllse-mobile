import { StyleSheet, Button } from "react-native";
import {
  followUser,
  unfollowUser,
  subscribeUser,
  unsubscribeUser,
} from "../../redux";
import { useDispatch } from "react-redux";
import React from "react";

const FollowUnfollowButton = ({ item, results, setResults }) => {
  const dispatch = useDispatch();

  console.log("item", item._id);

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

  const handleSubscribe = async (userId) => {
    try {
      await dispatch(subscribeUser(userId));
      const updatedResults = results.map((result) =>
        result._id === userId ? { ...result, isSubscribed: "pending" } : result
      );
      await setResults(updatedResults);
    } catch (error) {
      // Handle the error, e.g., show a message to the user
      console.error("Error subscribing to user:", error);
    }
  };

  const handleUnsubscribeUnfollow = async (userId) => {
    try {
      await dispatch(unfollowUser(userId));
      await dispatch(unsubscribeUser(userId));
      const updatedResults = results.map((result) =>
        result._id === userId
          ? { ...result, isFollowing: false, isSubscribed: null }
          : result
      );
      await setResults(updatedResults);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {item.isSubscribed === "accepted" ? (
        <Button
          title="Unsubscribe and Unfollow"
          onPress={() => handleUnsubscribeUnfollow(item._id)}
        />
      ) : item.isFollowing ? (
        <>
          <Button title="Unfollow" onPress={() => handleUnfollow(item._id)} />
          {item.isSubscribed === "pending" ? (
            <Button title="Pending" />
          ) : item.isSubscribed === "declined" ? (
            <Button title="Declined" />
          ) : (
            <Button
              title="Subscribe"
              onPress={() => handleSubscribe(item._id)}
            />
          )}
        </>
      ) : (
        <Button title="Follow" onPress={() => handleFollow(item._id)} />
      )}
    </>
  );
};

export default FollowUnfollowButton;

const styles = StyleSheet.create({});
