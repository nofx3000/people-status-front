import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:3000/api",
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
