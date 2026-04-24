import axios from "axios";

const API = axios.create({
  baseURL: "https://attendance-system-cb8z.onrender.com"
});

export default API;