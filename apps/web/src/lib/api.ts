import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

export const getProducts = (params?: any) =>
  api.get("/products", { params }).then((r) => r.data);
export const getProduct = (slug: string) =>
  api.get(`/products/${slug}`).then((r) => r.data);
export const searchProducts = (q: string, params?: any) =>
  api.get("/products/search", { params: { q, ...params } }).then((r) => r.data);

export const login = (data: any) =>
  api.post("/auth/login", data).then((r) => r.data);
export const register = (data: any) =>
  api.post("/auth/register", data).then((r) => r.data);
export const getProfile = () => api.get("/auth/me").then((r) => r.data);
export const refreshToken = () => api.post("/auth/refresh").then((r) => r.data);

export const createOrder = (data: any) =>
  api.post("/orders", data).then((r) => r.data);
export const getOrders = () => api.get("/orders").then((r) => r.data);
export const getOrder = (id: string) =>
  api.get(`/orders/${id}`).then((r) => r.data);
