const fs = require("fs");
const path = require("path");

const galleryDir = path.join(__dirname, "../public/gallery-images");
const outputFile = path.join(__dirname, "../src/gallery-images.json");
const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".svg",
]; // 支持的图片扩展名

// 1. 确保 gallery-images 文件夹存在
if (!fs.existsSync(galleryDir)) {
  console.log(`Creating directory: ${galleryDir}`);
  fs.mkdirSync(galleryDir, { recursive: true });
}

try {
  // 2. 读取目录内容
  const files = fs.readdirSync(galleryDir);

  // 3. 过滤图片文件并生成相对路径
  const imageFiles = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map((file) => `/gallery-images/${file}`); // 生成相对于 public 的路径

  // 4. 写入 JSON 文件
  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2), "utf8");
  console.log(`Successfully generated image list: ${outputFile}`);
  console.log(`Found ${imageFiles.length} images.`);

  // 如果没有图片，也生成一个空数组的 JSON 文件
  if (imageFiles.length === 0 && !fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2), "utf8");
  }
} catch (err) {
  console.error("Error generating image list:", err);
  // 确保即使出错，也存在一个空的 JSON 文件，避免导入时出错
  if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2), "utf8");
    console.log(`Created empty image list due to error: ${outputFile}`);
  }
  process.exit(1); // 退出脚本并指示错误
}
