import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
    const status = error.response?.status;
    
    // Captura 401 (Unauthorized), 403 (Forbidden) e quando o servidor não responde
    const publicPaths = ["/login", "/register", "/complete-profile"];
    const isPublicRoute = publicPaths.some((p) => window.location.pathname.startsWith(p));

    if (!isPublicRoute && (status === 401 || status === 403 || !error.response)) {
      console.warn("Sessão expirada ou servidor indisponível. Redirecionando para login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }
    
    return Promise.reject(error);
  }
);