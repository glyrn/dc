#!/bin/bash

# --- 配置 ---
IMAGE_NAME="my-timeline-app"
CONTAINER_NAME="my-timeline-container"
HOST_PORT="8080"
# ------------

# 停止并移除现有容器 (忽略错误)
echo "正在停止并移除旧容器 ${CONTAINER_NAME} (如果存在)..."
docker stop ${CONTAINER_NAME} > /dev/null 2>&1
docker rm ${CONTAINER_NAME} > /dev/null 2>&1
echo "旧容器处理完毕。"

# 构建新镜像
echo "正在构建新镜像 ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .
if [ $? -ne 0 ]; then
    echo "镜像构建失败！"
    exit 1
fi

# 启动新容器
echo "正在启动新容器 ${CONTAINER_NAME}，映射端口 ${HOST_PORT}:80..."
docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "容器 ${CONTAINER_NAME} 已成功重启！"
    echo "访问: http://localhost:${HOST_PORT}"
else
    echo "容器启动失败！"
    exit 1
fi

exit 0 