'use client';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR';
  branchId: string | null;
  branch?: { id: string; name: string; city: string } | null;
};

export function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function setUser(user: AdminUser) {
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function getUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('admin_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearToken() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function isAuthenticated() {
  return !!getToken();
}

export function isSuperAdmin() {
  return getUser()?.role === 'SUPER_ADMIN';
}
