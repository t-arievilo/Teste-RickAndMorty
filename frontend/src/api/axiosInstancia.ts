import axios from "axios";

const axiosInstancia = axios.create({
  baseURL: "http://localhost:3001/api",
});

// injeta o token em toda requisição automaticamente
axiosInstancia.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstancia;
