export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
}

export function getStoredAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, refreshToken: null };
  }
  const token = localStorage.getItem('pgflow_token');
  const refreshToken = localStorage.getItem('pgflow_refresh_token');
  const userStr = localStorage.getItem('pgflow_user');
  const user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
  return { user, token, refreshToken };
}

export function setStoredAuth(data: { user: AuthUser; accessToken: string; refreshToken: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pgflow_token', data.accessToken);
  localStorage.setItem('pgflow_refresh_token', data.refreshToken);
  localStorage.setItem('pgflow_user', JSON.stringify(data.user));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pgflow_token');
  localStorage.removeItem('pgflow_refresh_token');
  localStorage.removeItem('pgflow_user');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('pgflow_token');
}
