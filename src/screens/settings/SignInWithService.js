import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "../../components/text";
import Icon from "../../components/icon";
import InAppBrowser from "react-native-inappbrowser-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInWithService = () => {
  const [spotifyState, setSpotifyState] = useState(false);
  const openUrl = (url) => {
    InAppBrowser.isAvailable().then((isAvailable) => {
      if (isAvailable) {
        const browser = InAppBrowser.open(url, "_blank");

        // Add the event listener for the 'loadstart' event
        // browser.addEventListener("loadstart", (event) => {
        //   if (event.url.startsWith("pulse://callback")) {
        //     // Close the InAppBrowser if the URL starts with the custom scheme 'pulse://'
        //     browser.close();
        //   }
        // });
      } else {
        Linking.openURL(url);
      }
    });
  };

  const checkSpotifyLogin = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      setSpotifyState(true);
    }
  };
  useEffect(() => {
    checkSpotifyLogin();
  }, []);

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
      {!spotifyState ? (
        <View style={styles.container}>
          <CustomText style={{ fontSize: 24 }}>
            Successfully signed in
          </CustomText>

          <View style={styles.viewSpoty}>
            <Icon name="spotifyIcon" style={{ width: 50, height: 50 }} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <CustomText style={{ fontSize: 24 }}>Sign In With Spotify</CustomText>
          <TouchableOpacity
            onPress={() => {
              openUrl(
                "https://bcd7-108-36-184-166.ngrok-free.app/loginSpotify"
              );
              // openUrl("https://google.com");
            }}
          >
            <View style={styles.viewSpoty}>
              <Icon name="spotifyIcon" style={{ width: 50, height: 50 }} />
            </View>
          </TouchableOpacity>
        </View>
      )}
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
