import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kalashree_student_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the student's token has expired/is invalid, bounce them back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("kalashree_student_token");
      localStorage.removeItem("kalashree_student_profile");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
