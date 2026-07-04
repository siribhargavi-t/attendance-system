import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://attendance-system-cb8z.onrender.com"
});

export default API;