import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "http://localhost:4000/",
});

instance.interceptors.request.use(
  async (config) => {
    const userId = await AsyncStorage.getItem("userId");

    if (userId) {
      config.headers.userId = userId;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
