import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Địa chỉ API của backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
