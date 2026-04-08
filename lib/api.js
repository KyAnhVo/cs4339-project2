import axios from "axios";
// Import mock setup

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export default api;
