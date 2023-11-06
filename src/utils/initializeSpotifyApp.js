import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../config";

// This function should be called every time the app is opened or comes to the foreground
const initializeApp = async () => {
  await getAccessToken(); // This will refresh the token if it's expired
  // Now you can use the access token to make API requests, etc.
};

// This function checks the expiry time of the token and refreshes it if necessary
const getAccessToken = async () => {
  const expiryTime = await AsyncStorage.getItem("expiryTime");
  const currentTime = Date.now();

  // Convert to numbers for comparison
  const expiryTimeNumber = expiryTime ? parseInt(expiryTime, 10) : 0;

  if (currentTime >= expiryTimeNumber) {
    console.log("refreshed");
    // Token is expired or about to expire, refresh it
    return await refreshAccessToken();
  } else {
    console.log("returned");
    // Token is still valid, return it
    return await AsyncStorage.getItem("accessToken");
  }
};

// This function refreshes the access token and updates the expiry time
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  // Call your backend endpoint to refresh the token
  try {
    const response = await axios.post(config.apiURL + "refresh", {
      refreshToken,
    });

    const { accessToken, expiresIn } = response.data;

    // Calculate and store the new expiry time
    const expiryTime = Date.now() + expiresIn * 1000;
    await AsyncStorage.setItem("expiryTime", expiryTime.toString());
    await AsyncStorage.setItem("accessToken", accessToken);

    // Optionally, set a timer to automatically refresh the token before it expires again
    setTimeout(() => {
      refreshAccessToken();
    }, (expiresIn - 300) * 1000); // Refresh 5 minutes before expiration, as an example

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // You may need to handle re-authentication here
  }
};

// Call initializeApp when the app is loaded
export { getAccessToken };
