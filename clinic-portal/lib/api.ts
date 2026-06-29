import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('portal_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

function logout() {
  localStorage.removeItem('portal_token');
  localStorage.removeItem('portal_refresh');
  localStorage.removeItem('portal_user');
  window.location.href = '/login';
}

// Single in-flight refresh shared by concurrent 401s
let refreshing: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const refresh = localStorage.getItem('portal_refresh');
  if (!refresh) return null;
  try {
    const res = await axios.post(`${BASE}/api/auth/refresh`, { refreshToken: refresh });
    const { accessToken, refreshToken } = res.data;
    localStorage.setItem('portal_token', accessToken);
    if (refreshToken) localStorage.setItem('portal_refresh', refreshToken);
    return accessToken;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config;
    const status = err.response?.status;

    if (typeof window === 'undefined' || !original) return Promise.reject(err);

    // Don't try to refresh the auth calls themselves
    const isAuthCall =
      original.url?.includes('/api/auth/refresh') || original.url?.includes('/api/auth/login');

    if (status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshing = refreshing ?? doRefresh();
      const newToken = await refreshing;
      refreshing = null;

      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      logout();
    }

    return Promise.reject(err);
  }
);

export default api;
