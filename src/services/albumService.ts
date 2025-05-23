import axios from 'axios';
import { API_BASE_URL } from '../config';

// 相册数据类型定义
export interface Album {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface AlbumImage {
  url: string;
  filename: string;
  size: number;
  content_type: string;
  uploaded_at: string;
}

export interface CreateAlbumRequest {
  name: string;
  description?: string;
}

// 获取认证token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// 创建带认证的axios实例
const createAuthenticatedRequest = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
};

// 获取相册列表
export const getAlbums = async (): Promise<Album[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/albums`, createAuthenticatedRequest());
    return response.data;
  } catch (error) {
    console.error('获取相册列表失败:', error);
    throw error;
  }
};

// 创建新相册
export const createAlbum = async (albumData: CreateAlbumRequest): Promise<Album> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/albums`, albumData, createAuthenticatedRequest());
    return response.data;
  } catch (error) {
    console.error('创建相册失败:', error);
    throw error;
  }
};

// 上传图片到相册
export const uploadImageToAlbum = async (albumId: number, file: File): Promise<AlbumImage> => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/api/albums/${albumId}/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
};

// 获取相册中的图片列表
export const getAlbumImages = async (albumId: number): Promise<AlbumImage[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/albums/${albumId}/images`, createAuthenticatedRequest());
    return response.data;
  } catch (error) {
    console.error('获取相册图片失败:', error);
    throw error;
  }
}; 