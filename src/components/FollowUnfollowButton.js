import { StyleSheet, Text, Button } from "react-native";
import { followUser, unfollowUser, subscribeUser } from "../redux";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

const FollowUnfollowButton = ({ item, results, setResults }) => {
  const dispatch = useDispatch();

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

  return (
    <>
      {item.isSubscribed === "accepted" ? (
        <Button
          title="Unsubscribe and Unfollow"
          onPress={() => handleUnsubscribe(item._id)}
        />
      ) : item.isFollowing ? (
        <>
          <Button title="Unfollow" onPress={() => handleUnfollow(item._id)} />
          {item.isSubscribed === "pending" ? (
            <Button title="Pending" />
          ) : (
            <Button
              title="Subscribe"
              onPress={() => handleSubscribe(item._id)}
            />
          )}
          {item.isSubscribed === "declined" && <Button title="Declined" />}
        </>
      ) : (
        <Button title="Follow" onPress={() => handleFollow(item._id)} />
      )}
    </>
  );
};

export default FollowUnfollowButton;

const styles = StyleSheet.create({});
