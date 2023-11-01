import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import CustomText from "../../components/text";
import Icon from "../../components/icon";

const SignInWithService = () => {
  return (
    <View>
      {/* <View style={styles.container}>
        <CustomText style={{ fontSize: 24 }}>Sign In With Apple</CustomText>
        <TouchableOpacity>
          <View style={styles.viewApple}>
            <Icon name="appleIcon" style={{ width: 50, height: 50 }} />
          </View>
        </TouchableOpacity>
      </View> */}

      <View style={styles.container}>
        <CustomText style={{ fontSize: 24 }}>Sign In With Spotify</CustomText>
        <TouchableOpacity>
          <View style={styles.viewSpoty}>
            <Icon name="spotifyIcon" style={{ width: 50, height: 50 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInWithService;

const styles = StyleSheet.create({
  viewSpoty: {
    borderRadius: 20,
    width: 70,
    height: 70,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  viewApple: {
    borderRadius: 20,
    width: 70,
    height: 70,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  container: {
    marginTop: 50,
    height: 100,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
});
