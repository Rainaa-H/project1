let runtimeConfigPromise;

export async function apiUrl(path) {
  const config = await loadRuntimeConfig();
  const baseUrl = import.meta.env?.VITE_API_BASE_URL || "";
  const runtimeBaseUrl = config.apiBaseUrl || baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!runtimeBaseUrl) return normalizedPath;
  return `${runtimeBaseUrl.replace(/\/+$/, "")}${normalizedPath}`;
}

async function loadRuntimeConfig() {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch(`${import.meta.env.BASE_URL}config.json`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : {})
      .catch(() => ({}));
  }
  return runtimeConfigPromise;
}
