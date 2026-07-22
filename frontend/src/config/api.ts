const rawApiBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL || '').trim();

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
