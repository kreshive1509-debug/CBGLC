const VISITOR_TOKEN_KEY = 'cbgl_visitor_token';
const VISITOR_COUNTED_KEY = 'cbgl_visitor_counted';
const VISITOR_COOKIE_NAME = 'cbgl_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5;

const createVisitorToken = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
};

const writeVisitorCookie = (token: string) => {
  document.cookie = `${VISITOR_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${VISITOR_COOKIE_MAX_AGE}; samesite=lax`;
};

export const getOrCreateVisitorToken = () => {
  if (typeof window === 'undefined') return '';

  try {
    const storedToken = window.localStorage.getItem(VISITOR_TOKEN_KEY);
    if (storedToken) {
      writeVisitorCookie(storedToken);
      return storedToken;
    }

    const cookieToken = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${VISITOR_COOKIE_NAME}=`))
      ?.split('=')
      .slice(1)
      .join('=');

    if (cookieToken) {
      const decodedToken = decodeURIComponent(cookieToken);
      window.localStorage.setItem(VISITOR_TOKEN_KEY, decodedToken);
      writeVisitorCookie(decodedToken);
      return decodedToken;
    }

    const token = createVisitorToken();
    window.localStorage.setItem(VISITOR_TOKEN_KEY, token);
    writeVisitorCookie(token);
    return token;
  } catch {
    const token = createVisitorToken();
    try {
      writeVisitorCookie(token);
    } catch {
      // Ignore cookie write failures in restricted browser contexts.
    }
    return token;
  }
};

export const hasVisitorBeenCounted = (token: string) => {
  if (typeof window === 'undefined' || !token) return false;
  return window.localStorage.getItem(VISITOR_COUNTED_KEY) === token;
};

export const markVisitorCounted = (token: string) => {
  if (typeof window === 'undefined' || !token) return;
  window.localStorage.setItem(VISITOR_COUNTED_KEY, token);
};
