const rawApiBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL || '').trim();

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalizedPath}`;
  }

  throw new Error(`VITE_API_BASE_URL is not configured. Cannot build API URL for ${normalizedPath}`);
};
