import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import RouterProvider from "./router/index";
import { Provider } from "react-redux";
// import axios from "axios";
import store from "./store/store";
import { App } from "antd";
// axios.defaults.baseURL = "http://127.0.0.1:3000/api";
// axios.interceptors.request.use(
//   (config) => {
//     // 在发送请求之前可以进行一些处理，例如添加请求头、设置认证信息等
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = token;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider />
      </App>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
