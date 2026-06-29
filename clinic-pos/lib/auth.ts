export type PosUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CASHIER';
  branchId: string | null;
  branch?: { id: string; name: string; city: string } | null;
};

const TOKEN_KEY = 'pos_token';
const REFRESH_KEY = 'pos_refresh';
const USER_KEY = 'pos_user';
const BRANCH_KEY = 'pos_active_branch'; // for SUPER_ADMIN branch override

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

export function getRefresh(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefresh(r: string) {
  localStorage.setItem(REFRESH_KEY, r);
}

export function getUser(): PosUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setUser(u: PosUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function clearAuth() {
  [TOKEN_KEY, REFRESH_KEY, USER_KEY, BRANCH_KEY].forEach(k => localStorage.removeItem(k));
}

// Active branch: SUPER_ADMIN picks one; others = their own branchId
export function getActiveBranchId(): string | null {
  if (typeof window === 'undefined') return null;
  const override = localStorage.getItem(BRANCH_KEY);
  if (override) return override;
  return getUser()?.branchId ?? null;
}

export function setActiveBranch(branchId: string, branchData?: { id: string; name: string; city: string }) {
  localStorage.setItem(BRANCH_KEY, branchId);
  if (branchData) {
    const u = getUser();
    if (u) setUser({ ...u, branch: branchData });
  }
}

export function clearActiveBranch() {
  localStorage.removeItem(BRANCH_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
