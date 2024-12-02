import axios from "axios";
import { BASR_API_URL } from "../constant/index";

const request = axios.create({
  baseURL: BASR_API_URL,
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default request;
