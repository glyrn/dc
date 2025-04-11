// 移除axios依赖，使用原生fetch API
// import axios from 'axios';

interface AccessLogEntry {
  identity: string;
  timestamp: string;
}

// 定义API基础URL，从环境变量中获取
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * 获取指定时间范围内的访问日志
 * @param since 起始时间 (ISO 8601格式)
 * @param until 结束时间 (ISO 8601格式)
 * @param identity 可选的身份过滤
 * @returns 访问日志条目数组
 */
export const getAccessLogs = async (
  since?: string,
  until?: string,
  identity?: string
): Promise<AccessLogEntry[]> => {
  try {
    // 从localStorage获取认证token
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('未认证，无法获取访问日志');
    }

    // 构建查询参数
    const params: string[] = [];
    if (since) params.push(`since=${encodeURIComponent(since)}`);
    if (until) params.push(`until=${encodeURIComponent(until)}`);
    if (identity) params.push(`identity=${encodeURIComponent(identity)}`);

    // 构建URL
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    const url = `${API_BASE_URL}/api/access-log${queryString}`;

    // 发送请求
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('获取访问日志失败:', error);
    throw error;
  }
};

// 格式化时间为"多久前"的形式
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval}年前`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval}个月前`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '昨天' : `${interval}天前`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval}小时前`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval}分钟前`;
  }
  
  return '刚刚';
};

// 统计当日访问次数
export const countTodayVisits = (logs: AccessLogEntry[]): Record<string, number> => {
  const today = new Date().toISOString().split('T')[0]; // 获取今天的日期部分 YYYY-MM-DD
  
  // 筛选今天的访问记录并统计每个用户的访问次数
  const counts: Record<string, number> = {};
  
  logs.forEach(log => {
    const logDate = new Date(log.timestamp).toISOString().split('T')[0];
    if (logDate === today) {
      counts[log.identity] = (counts[log.identity] || 0) + 1;
    }
  });
  
  return counts;
}; 