/**
 * 日记功能配置文件
 * 用于定义日记文件的位置、格式和读取方式
 */

const diaryConfig = {
  // 日记文件存放的根目录（相对于public文件夹）
  basePath: "/diaries",

  // 日记文件格式
  // 支持两种模式：folder(文件夹) 或 file(单文件)
  mode: "folder",

  // 文件夹模式配置
  folderConfig: {
    // 文件夹命名格式，使用年月
    folderFormat: "YYYY-MM",

    // 文件命名格式，使用年月日
    fileFormat: "YYYY-MM-DD.json",
  },

  // 单文件模式配置
  fileConfig: {
    // 单文件命名格式
    fileFormat: "YYYY-MM-DD.json",
  },

  // 日记文件结构
  entryStructure: {
    title: "标题", // 日记标题字段名
    content: "内容", // 日记内容字段名
    mood: "心情", // 日记心情字段名
    date: "日期", // 日期字段名
  },

  // 心情映射
  moodMapping: {
    开心: "happy",
    愉快: "joyful",
    沉思: "reflective",
    成就感: "accomplished",
    兴奋: "excited",
    平静: "calm",
    疲惫: "tired",
    失落: "sad",
  },

  // 默认心情
  defaultMood: "calm",
};

export default diaryConfig;
