#!/bin/bash

# --- 配置 ---
IMAGE_NAME="my-timeline-app"
CONTAINER_NAME="my-timeline-container"
HOST_PORT="8080"
# ------------

# 检查容器是否已在运行
if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "容器 ${CONTAINER_NAME} 已经在运行。"
    echo "如果需要重启，请使用 restart.sh"
    exit 1
fi

# 检查是否存在已停止的同名容器，如果存在则移除
if [ "$(docker ps -aq -f status=exited -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "移除已停止的容器 ${CONTAINER_NAME}..."
    docker rm ${CONTAINER_NAME}
fi

# 构建镜像
echo "正在构建镜像 ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .
if [ $? -ne 0 ]; then
    echo "镜像构建失败！"
    exit 1
fi

# 运行容器
echo "正在启动容器 ${CONTAINER_NAME}，映射端口 ${HOST_PORT}:80..."
docker run -d -p ${HOST_PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "容器 ${CONTAINER_NAME} 已成功启动！"
    echo "访问: http://localhost:${HOST_PORT}"
else
    echo "容器启动失败！"
    exit 1
fi

exit 0 