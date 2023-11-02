import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import config from "../../../config";

const instance = axios.create({
  baseURL: config.spotifyURL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("acessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
