import { API_BASE_URL } from '../config';
import { getAuthToken, handleApiResponse } from './authService';
import type { NavigateFunction } from 'react-router-dom';

export interface Whisper {
  id: string;
  message: string;
  timestamp: string;
}

// 获取所有悄悄话
export const getAllWhispers = async (
  navigate: NavigateFunction,
  limit?: number
): Promise<Whisper[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('用户未登录');
  }

  let url = `${API_BASE_URL}/api/whispers`;
  if (limit) {
    url += `?limit=${limit}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await handleApiResponse<Whisper[]>(response, navigate);
  return data;
};

// 发送悄悄话
export const sendWhisper = async (
  navigate: NavigateFunction,
  message: string
): Promise<Whisper> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('用户未登录');
  }

  const response = await fetch(`${API_BASE_URL}/api/whispers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await handleApiResponse<Whisper>(response, navigate);
  return data;
};

// 删除悄悄话
export const deleteWhisper = async (
  navigate: NavigateFunction,
  whisperId: string
): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('用户未登录');
  }

  const response = await fetch(`${API_BASE_URL}/api/whispers/${whisperId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await handleApiResponse<void>(response, navigate);
};

// 格式化时间戳为友好格式
export const formatWhisperTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay}天前`;
  } else if (diffHour > 0) {
    return `${diffHour}小时前`;
  } else if (diffMin > 0) {
    return `${diffMin}分钟前`;
  } else {
    return '刚刚';
  }
}; 