import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: any) => {
    const response = await api.post("/register", data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  me: async () => {
    const response = await api.get("/me");
    return response.data;
  },
};

// Complaint API
export const complaintAPI = {
  create: async (formData: FormData) => {
    const response = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  findByTicket: async (ticketNumber: string) => {
    const response = await api.get(`/complaints/ticket/${ticketNumber}`);
    return response.data;
  },

  getAll: async (params?: any) => {
    const response = await api.get("/complaints", { params });
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/complaints/${id}`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/complaints-stats");
    return response.data;
  },
};

export default api;
