import axios from "axios";

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://148.135.137.229:3000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export default axiosInstance;
