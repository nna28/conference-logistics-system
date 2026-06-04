import axios from "axios";

const api = axios.create({
  // ✅ Đổi thành "/api" để khớp với cấu hình proxy trong vite.config.js
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;