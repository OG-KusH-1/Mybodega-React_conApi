import axios from "axios";
import AuthService from "./AuthService";

// URL base de tu API - asegúrate de que sea correcta
const API_URL = "http://localhost:8090/api"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir automáticamente el token
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`🔵 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log(`🔑 Token presente:`, !!token);

    return config;
  },
  (error) => {
    console.error("❌ Error en request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para capturar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error("❌ Error en response:", error.response?.status, error.config?.url);
    
    // Solo cerrar sesión en 401 (no autorizado), no en 403 (prohibido)
    // 403 puede significar que el usuario no tiene permisos pero está autenticado
    if (error.response?.status === 401) {
      console.warn("⚠️ Token inválido o expirado (401), cerrando sesión...");
      AuthService.logout();
      
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      console.warn("⚠️ Acceso prohibido (403) - El usuario no tiene permisos o hay un problema con el token");
      // No cerramos sesión automáticamente en 403, dejamos que cada componente lo maneje
    }
    
    return Promise.reject(error);
  }
);

export default api;