#!/bin/bash

# --- 配置 ---
CONTAINER_NAME="my-timeline-container"
# ------------

# 检查容器是否存在并运行
if [ ! "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
    # 检查是否存在已停止的容器
    if [ "$(docker ps -aq -f status=exited -f name=^/${CONTAINER_NAME}$)" ]; then
        echo "容器 ${CONTAINER_NAME} 已停止，正在移除..."
        docker rm ${CONTAINER_NAME}
        echo "容器 ${CONTAINER_NAME} 已移除。"
    else
        echo "容器 ${CONTAINER_NAME} 未找到或未在运行。"
    fi
    exit 0
fi

# 停止容器
echo "正在停止容器 ${CONTAINER_NAME}..."
docker stop ${CONTAINER_NAME}

# 移除容器
echo "正在移除容器 ${CONTAINER_NAME}..."
docker rm ${CONTAINER_NAME}

echo "容器 ${CONTAINER_NAME} 已成功停止并移除。"
exit 0 