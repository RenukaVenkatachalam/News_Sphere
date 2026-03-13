import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // prevent requests hanging forever
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- Request Interceptor ---------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- Response Interceptor ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Handle expired / invalid token
    if (status === 401) {
      localStorage.removeItem("token");

      // Optional: redirect to login if needed
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Network error
    if (!error.response) {
      console.error("Network error or server unreachable");
    }

    return Promise.reject(error);
  }
);

export default api;