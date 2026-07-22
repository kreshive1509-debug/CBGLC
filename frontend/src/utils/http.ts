type ApiRequestContext = {
  component: string;
  url: string;
  method: string;
};

const buildLogPrefix = ({ component, method, url }: ApiRequestContext) => `[API:${component}] ${method} ${url}`;

export const apiFetch = async (url: string, init: RequestInit = {}, component = 'Unknown') => {
  const method = (init.method || 'GET').toUpperCase();
  console.info(buildLogPrefix({ component, method, url }));
  try {
    const response = await fetch(url, init);
    const contentType = response.headers.get('content-type') || 'unknown content-type';
    console.info(`[API:${component}] ${method} ${url} -> ${response.status} ${contentType}`);
    return response;
  } catch (error) {
    console.warn(`[API:${component}] ${method} ${url} -> network error`, error);
    throw error;
  }
};

export const safeJson = async <T = any>(response: Response, context: string): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.toLowerCase().includes('application/json')) {
    const bodyText = await response.text().catch(() => '');
    const preview = bodyText.slice(0, 180).replace(/\s+/g, ' ').trim();
    throw new Error(
      `${context}: expected application/json but received ${contentType || 'unknown content-type'}${preview ? `; body: ${preview}` : ''}`
    );
  }

  return response.json() as Promise<T>;
};
