import diaryConfig from "../config/diary.config";
import dayjs from "dayjs";

/**
 * 日记服务 - 用于从文件系统读取日记文件
 */
class DiaryService {
  /**
   * 获取指定月份的所有日记
   * @param {number} year - 年份
   * @param {number} month - 月份（0-11）
   * @returns {Promise<Array>} - 返回日记数组的Promise
   */
  async getMonthEntries(year, month) {
    try {
      // 格式化年月
      const yearMonth = dayjs(new Date(year, month, 1)).format("YYYY-MM");

      // 根据配置的模式决定如何读取日记
      if (diaryConfig.mode === "folder") {
        // 获取该月的文件列表
        const folderPath = `${diaryConfig.basePath}/${yearMonth}`;
        const response = await fetch(`${folderPath}/index.json`);

        // 如果index.json不存在，说明该月没有索引文件，尝试直接读取该月所有日记文件
        if (!response.ok) {
          // 这里我们需要一种方式来列出文件夹中的所有文件
          // 在纯前端环境中这是有限制的，所以我们使用约定的文件名规则

          // 获取该月的天数
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          // 尝试读取每一天的日记
          const entries = [];
          for (let day = 1; day <= daysInMonth; day++) {
            // 格式化日期但不保存到变量，直接传给getEntry
            try {
              const entry = await this.getEntry(year, month, day);
              if (entry) {
                entries.push(entry);
              }
            } catch (e) {
              // 忽略不存在的日记文件
            }
          }

          return entries;
        } else {
          // 使用索引文件
          const index = await response.json();

          // 读取每个日记文件
          const entries = await Promise.all(
            index.map(async (filename) => {
              const fileResponse = await fetch(`${folderPath}/${filename}`);
              if (fileResponse.ok) {
                const data = await fileResponse.json();
                return this.formatEntry(data);
              }
              return null;
            })
          );

          return entries.filter((entry) => entry !== null);
        }
      } else {
        // 单文件模式 - 直接读取年月对应的单个文件
        const response = await fetch(
          `${diaryConfig.basePath}/${yearMonth}.json`
        );
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data)
            ? data.map((entry) => this.formatEntry(entry))
            : [];
        }
        return [];
      }
    } catch (error) {
      console.error("Error fetching month entries:", error);
      return [];
    }
  }

  /**
   * 获取指定日期的日记
   * @param {number} year - 年份
   * @param {number} month - 月份（0-11）
   * @param {number} day - 日
   * @returns {Promise<Object|null>} - 返回日记对象的Promise，如果不存在则返回null
   */
  async getEntry(year, month, day) {
    try {
      const date = new Date(year, month, day);
      const dateStr = dayjs(date).format("YYYY-MM-DD");
      const yearMonth = dayjs(date).format("YYYY-MM");

      // 根据配置的模式决定如何读取日记
      let filePath;
      if (diaryConfig.mode === "folder") {
        filePath = `${diaryConfig.basePath}/${yearMonth}/${dateStr}.json`;
      } else {
        filePath = `${diaryConfig.basePath}/${dateStr}.json`;
      }

      const response = await fetch(filePath);
      if (response.ok) {
        const data = await response.json();
        return this.formatEntry(data);
      }
      return null;
    } catch (error) {
      console.error(
        `Error fetching entry for ${year}-${month + 1}-${day}:`,
        error
      );
      return null;
    }
  }

  /**
   * 获取当前月份所有有日记的日期
   * @param {number} year - 年份
   * @param {number} month - 月份（0-11）
   * @returns {Promise<Array<string>>} - 返回有日记的日期字符串数组
   */
  async getEntriesForMonth(year, month) {
    try {
      const entries = await this.getMonthEntries(year, month);
      return entries.map((entry) => entry.date);
    } catch (error) {
      console.error("Error fetching entries for month:", error);
      return [];
    }
  }

  /**
   * 格式化日记条目，统一字段名
   * @param {Object} rawEntry - 原始日记数据
   * @returns {Object} - 格式化后的日记对象
   */
  formatEntry(rawEntry) {
    const { entryStructure, moodMapping, defaultMood } = diaryConfig;

    // 提取字段
    const title = rawEntry[entryStructure.title] || "";
    const content = rawEntry[entryStructure.content] || "";
    const rawMood = rawEntry[entryStructure.mood] || "";
    const date = rawEntry[entryStructure.date] || "";

    // 转换心情
    const mood = moodMapping[rawMood] || defaultMood;

    return {
      title,
      content,
      mood,
      date,
    };
  }
}

// 创建服务实例
const diaryServiceInstance = new DiaryService();

export default diaryServiceInstance;
