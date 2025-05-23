import diaryConfig from "../config/diary.config";
// import dayjs from "dayjs"; // Removed unused import

// 从 .env 文件获取 API 基础 URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// 确保 API_BASE_URL 末尾没有斜杠
const cleanApiBaseUrl = API_BASE_URL.endsWith("/")
  ? API_BASE_URL.slice(0, -1)
  : API_BASE_URL;

/**
 * 日记服务 - 用于通过 API 获取日记数据
 */
class DiaryService {
  /**
   * 获取认证 token
   * @returns {string|null} 认证 token 或 null
   * @private
   */
  _getAuthToken() {
    return localStorage.getItem("auth_token");
  }

  /**
   * 创建带认证的请求头
   * @returns {Object} 请求头对象
   * @private
   */
  _createHeaders(contentType = "application/json") {
    const headers = {
      "Content-Type": contentType,
    };

    const token = this._getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 检查响应状态码，处理 401 (未授权) 错误
   * @param {Response} response - fetch 响应对象
   * @private
   */
  _handleAuthError(response) {
    if (response.status === 401) {
      console.error("认证失败: Token 无效或已过期");
      // 清除过期的 token
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_identity");
      // 重定向到欢迎页面重新认证
      window.location.href = "/";
      throw new Error("认证已过期，请重新登录");
    }
  }

  /**
   * 获取指定月份包含日记的日期列表
   * @param {number} year - 年份
   * @param {number} month - 月份（1-12）
   * @returns {Promise<number[]>} - 返回包含日（1-31）的数组
   */
  async getDiaryMonthStatus(year, month) {
    if (!cleanApiBaseUrl) {
      console.error(
        "API base URL is not configured in .env file (REACT_APP_API_BASE_URL)"
      );
      return [];
    }
    const url = `${cleanApiBaseUrl}/api/diary/month-status?year=${year}&month=${month}`;
    try {
      const response = await fetch(url, {
        headers: this._createHeaders(),
      });

      this._handleAuthError(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching month status for ${year}-${month}:`, error);
      return [];
    }
  }

  /**
   * 获取指定日期的日记详情
   * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
   * @returns {Promise<Object | null>} - 返回日记对象或 null
   */
  async getDiaryEntry(dateStr) {
    if (!cleanApiBaseUrl) {
      console.error(
        "API base URL is not configured in .env file (REACT_APP_API_BASE_URL)"
      );
      return null;
    }
    const url = `${cleanApiBaseUrl}/api/diary/entry?date=${dateStr}`;
    try {
      const response = await fetch(url, {
        headers: this._createHeaders(),
      });

      this._handleAuthError(response);

      if (response.status === 404) {
        return null; // 日记不存在
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.formatEntry(data);
    } catch (error) {
      console.error(`Error fetching entry for ${dateStr}:`, error);
      return null;
    }
  }

  /**
   * 创建新的日记条目
   * @param {Object} entryData - 包含 date, title, content, mood 的日记数据
   * @returns {Promise<Object | null>} - 返回创建成功的日记对象或 null
   */
  async createDiaryEntry(entryData) {
    if (!cleanApiBaseUrl) {
      console.error("API base URL not configured");
      return null;
    }
    const url = `${cleanApiBaseUrl}/api/diary/entry`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this._createHeaders(),
        body: JSON.stringify(entryData),
      });

      this._handleAuthError(response);

      if (!response.ok) {
        // 可以根据 status code 给出更具体的错误信息
        if (response.status === 409) {
          throw new Error(
            "Conflict: Diary entry for this date already exists."
          );
        }
        if (response.status === 400) {
          throw new Error("Bad Request: Invalid data provided.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.formatEntry(data); // 假设返回的数据需要格式化
    } catch (error) {
      console.error("Error creating diary entry:", error);
      // 将错误向上抛出，以便 UI 层可以捕获并显示
      throw error;
    }
  }

  /**
   * 更新指定日期的日记条目
   * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
   * @param {Object} entryData - 包含 title, content, mood 的更新数据
   * @returns {Promise<Object | null>} - 返回更新成功的日记对象或 null
   */
  async updateDiaryEntry(dateStr, entryData) {
    if (!cleanApiBaseUrl) {
      console.error("API base URL not configured");
      return null;
    }
    const url = `${cleanApiBaseUrl}/api/diary/entry/${dateStr}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: this._createHeaders(),
        body: JSON.stringify(entryData),
      });

      this._handleAuthError(response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Not Found: Diary entry for this date does not exist."
          );
        }
        if (response.status === 400) {
          throw new Error("Bad Request: Invalid data provided.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.formatEntry(data); // 假设返回的数据需要格式化
    } catch (error) {
      console.error(`Error updating diary entry for ${dateStr}:`, error);
      // 将错误向上抛出
      throw error;
    }
  }

  /**
   * 格式化日记条目，统一字段名
   * @param {Object} rawEntry - 从 API 获取的原始日记数据
   * @returns {Object} - 返回格式化后的日记对象
   */
  formatEntry(rawEntry) {
    const { entryStructure, moodMapping, defaultMood } = diaryConfig;

    const title = rawEntry.title || rawEntry[entryStructure.title] || "";
    const content = rawEntry.content || rawEntry[entryStructure.content] || "";
    const rawMood = rawEntry.mood || rawEntry[entryStructure.mood] || "";
    const date = rawEntry.date || rawEntry[entryStructure.date] || "";

    // 检查rawMood是否已经是有效的英文心情值
    const validEnglishMoods = [
      "happy",
      "joyful",
      "reflective",
      "accomplished",
      "excited",
      "calm",
      "tired",
      "sad",
      "neutral",
    ];

    // 如果rawMood已经是有效的英文值，直接使用，否则应用映射
    const mood = validEnglishMoods.includes(rawMood)
      ? rawMood
      : moodMapping[rawMood] || defaultMood;

    return {
      date,
      title,
      content,
      mood,
    };
  }
}

// 创建服务实例
const diaryServiceInstance = new DiaryService();

export default diaryServiceInstance;
