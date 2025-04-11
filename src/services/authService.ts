import { API_BASE_URL } from '../config';

// 保存登录后的 token
export const saveAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// 获取认证 token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// 清除 token (登出)
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// 检查用户是否已登录
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// 登录函数
export const login = async (passphrase: string): Promise<{ token: string; identity: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ passphrase }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || '登录失败');
  }

  const data = await response.json();
  saveAuthToken(data.token);
  return data;
};

// 登出函数
export const logout = (): void => {
  clearAuthToken();
}; 