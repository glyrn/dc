import { API_BASE_URL } from '../config';
import type { NavigateFunction } from 'react-router-dom';

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
  // 可选：登出后跳转到首页
  // window.location.href = '/'; 
};

/**
 * 处理 API 响应，特别是认证错误 (401)
 * @param response fetch 响应对象
 * @param navigate react-router 的 navigate 函数
 * @returns 解析后的 JSON 数据
 * @throws 如果响应不 ok (非 401) 或 JSON 解析失败，则抛出错误
 */
export const handleApiResponse = async <T>(
  response: Response,
  navigate: NavigateFunction
): Promise<T> => {
  if (response.status === 401) {
    console.error("认证失败: Token 无效或已过期 (handled by handleApiResponse)");
    
    // 在跳转前检查是否已经在欢迎页面，避免重复跳转
    if (window.location.pathname !== "/") {
      clearAuthToken(); // 清除 token
      localStorage.removeItem("user_identity"); // 也清除用户标识
      
      // 添加提示消息，让用户知道发生了什么
      localStorage.setItem("auth_expired", "true");
      
      // 使用 replace 而不是 push，这样用户返回时不会回到需要认证的页面
      navigate("/", { replace: true });
    }
    
    throw new Error("认证已过期，请重新登录");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
    console.error("API 请求失败:", errorData);
    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
  }

  // 尝试解析 JSON，如果响应体为空则返回 null 或 sesuai kebutuhan
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json() as T;
  } else {
    // 对于非 JSON 响应（例如 DELETE 成功时可能返回 204 No Content）
    // 可以根据需要返回 null 或者一个表示成功的对象
    return null as T; // 或者根据实际情况调整
  }
}; 