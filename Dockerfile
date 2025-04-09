# ---- Stage 1: Build ----
# 使用 Node.js 官方镜像作为构建环境
# 选择一个 LTS 版本，alpine 版本更小巧
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json*
# 利用 Docker 的缓存机制，只有当这些文件改变时才重新安装依赖
COPY package.json package-lock.json* ./

# 安装项目依赖
# 使用 npm ci 更快、更可靠，确保使用 lock 文件
RUN npm ci

# 复制项目源代码到工作目录
COPY . .

# 执行构建命令 (假设你的构建脚本是 'build')
RUN npm run build

# ---- Stage 2: Production ----
# 使用 Nginx 官方镜像作为运行环境
FROM nginx:stable-alpine

# 从构建阶段复制构建好的静态文件到 Nginx 的默认 Web 根目录
# 假设构建输出目录是 'build' (Create React App 默认)
# 如果你的输出目录不同 (例如 'dist')，请修改这里
COPY --from=builder /app/build /usr/share/nginx/html

# (可选但推荐) 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 默认监听的端口
EXPOSE 80

# 容器启动时运行 Nginx
# 'daemon off;' 让 Nginx 在前台运行，这是 Docker 容器推荐的方式
CMD ["nginx", "-g", "daemon off;"] 