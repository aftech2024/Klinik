import axios from 'axios';
import { getToken, getRefresh, setToken, setRefresh, clearAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(cfg => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

let refreshing: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const r = getRefresh();
  if (!r) throw new Error('no refresh token');
  const res = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken: r });
  const { accessToken, refreshToken } = res.data;
  setToken(accessToken);
  if (refreshToken) setRefresh(refreshToken);
  return accessToken;
}

api.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config;
    const url: string = original?.url ?? '';
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !url.includes('/api/auth/refresh') &&
      !url.includes('/api/auth/login')
    ) {
      original._retry = true;
      try {
        if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        clearAuth();
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
