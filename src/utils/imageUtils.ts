import imageCompression from 'browser-image-compression';

// 图片压缩默认选项
export const defaultCompressionOptions = {
  maxSizeMB: 1,            // 最大文件大小为1MB
  maxWidthOrHeight: 1920,  // 最大宽度或高度为1920px
  useWebWorker: true,      // 使用Web Worker以不阻塞UI
  initialQuality: 0.8,     // 初始压缩质量
};

// 缩略图压缩选项（用于相册封面等）
export const thumbnailCompressionOptions = {
  maxSizeMB: 0.3,          // 最大文件大小为0.3MB
  maxWidthOrHeight: 800,   // 最大宽度或高度为800px
  useWebWorker: true,      // 使用Web Worker以不阻塞UI
  initialQuality: 0.7,     // 初始压缩质量
};

/**
 * 压缩图像文件
 * @param file 要压缩的图像文件
 * @param options 压缩选项
 * @returns Promise<File> 压缩后的图像文件
 */
export const compressImage = async (
  file: File,
  options = defaultCompressionOptions
): Promise<File> => {
  try {
    // 检查文件是否为图像
    if (!file.type.startsWith('image/')) {
      console.warn(`文件 ${file.name} 不是图片，跳过压缩`);
      return file;
    }

    // 压缩图像
    const compressedFile = await imageCompression(file, options);
    console.log(
      `图片压缩完成: ${file.name}, 从 ${(file.size / 1024 / 1024).toFixed(2)} MB 压缩到 ${(
        compressedFile.size / 1024 / 1024
      ).toFixed(2)} MB`
    );

    return compressedFile;
  } catch (error) {
    console.error(`压缩图片 ${file.name} 失败:`, error);
    // 压缩失败时返回原始文件
    return file;
  }
};

/**
 * 获取图像URL的尺寸优化版本(用于外部图像服务，如Unsplash等)
 * @param url 原始图像URL
 * @param width 所需宽度
 * @returns 优化后的URL
 */
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  if (!url) return '';

  // 处理 Unsplash 图像
  if (url.includes('unsplash.com')) {
    // 添加宽度参数和图像质量参数
    const separator = url.includes('?') ? '&' : '?';
    const widthParam = width ? `w=${width}` : 'w=800';
    return `${url}${separator}${widthParam}&q=80&auto=format`;
  }

  // 这里可以添加其他图像服务的处理逻辑
  // 例如 Cloudinary, Imgix 等

  return url;
};

/**
 * 预加载图像
 * @param urls 要预加载的图像URL数组
 * @returns Promise 在所有图像加载完成后解析
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  const loadPromises = urls.map(
    (url) =>
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
          resolve(); // 即使加载失败也继续，不中断整个过程
        };
        img.src = url;
      })
  );

  return Promise.all(loadPromises);
};

/**
 * 检查浏览器是否支持WebP格式
 * @returns Promise<boolean> 表示是否支持WebP
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * 从文件生成本地预览URL
 * @param file 图像文件
 * @returns 用于预览的URL
 */
export const createLocalImageUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 释放通过URL.createObjectURL创建的对象URL
 * @param url 对象URL
 */
export const revokeLocalImageUrl = (url: string): void => {
  URL.revokeObjectURL(url);
}; 