import axios from "axios";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || "/api",
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 token 等
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res.data;
  },
  (error) => Promise.reject(error)
);

export default service;
