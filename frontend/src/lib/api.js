// frontend/src/lib/api.js
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const api = (path) =>
  API_BASE ? `${API_BASE}${path}` : path;

// per immagini/statici serviti dal backend
export const asset = (src) => {
  if (!src) return "";

  // già assoluto → non toccare
  if (/^https?:\/\//i.test(src)) return src;

  // roba del backend (/assets/...)
  if (src.startsWith("/assets")) return api(src);

  // fallback
  return src;
};