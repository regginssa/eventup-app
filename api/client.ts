import { SERVER_API_ENDPOINT } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: SERVER_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("Authorization");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

AxiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export const setAuthToken = async (token: string | null) => {
  try {
    if (token) {
      await AsyncStorage.setItem("Authorization", token);
      AxiosInstance.defaults.headers.common["Authorization"] = token;
    } else {
      await AsyncStorage.removeItem("Authorization");
      delete AxiosInstance.defaults.headers.common["Authorization"];
    }
  } catch (error) {
    // console.error("Error setting auth token:", error);
  }
};

export default AxiosInstance;
