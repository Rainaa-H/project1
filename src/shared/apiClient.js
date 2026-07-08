export function apiUrl(path) {
  const baseUrl = import.meta.env?.VITE_API_BASE_URL || "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!baseUrl) return normalizedPath;
  return `${baseUrl.replace(/\/+$/, "")}${normalizedPath}`;
}
