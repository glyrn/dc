#!/bin/bash
IMAGE_NAME="my-timeline-app"
echo "正在使用本地构建产物构建 Docker 镜像 ${IMAGE_NAME}..."

# 检查本地构建目录是否存在 (假设是 'build')
if [ ! -d "build" ]; then
    echo "错误: 本地构建目录 'build' 不存在！"
    echo "请先在本地运行 'npm run build' (或 yarn build)。"
    exit 1
fi

docker build -t ${IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo "Docker 镜像构建失败！"
    exit 1
else
    echo "Docker 镜像 ${IMAGE_NAME} 构建成功！"
    exit 0
fi 