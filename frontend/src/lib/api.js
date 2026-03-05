// frontend/src/lib/api.js
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
export const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);