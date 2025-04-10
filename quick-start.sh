#!/bin/bash

# --- 配置 (确保与 start.sh, stop.sh, build.sh 一致) ---
IMAGE_NAME="my-timeline-app"
CONTAINER_NAME="my-timeline-container"
# ------------

# 检查 Node.js 和 npm 是否安装
if ! command -v node > /dev/null 2>&1; then
    echo "错误：未找到 Node.js 命令。请确保 Node.js 已安装。"
    exit 1
fi
if ! command -v npm > /dev/null 2>&1; then
    echo "错误：未找到 npm 命令。请确保 npm 已安装。"
    exit 1
fi

# 检查 Docker 是否安装
if ! command -v docker > /dev/null 2>&1; then
    echo "错误：未找到 Docker 命令。请确保 Docker 已安装并配置正确。"
    exit 1
fi

echo "步骤 1: 安装/更新项目依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误：npm install 失败。"
    exit 1
fi

echo "步骤 2: 构建 React 应用 (npm run build)..."
npm run build
if [ $? -ne 0 ]; then
    echo "错误：npm run build 失败。"
    exit 1
fi
echo "React 应用构建完成。"

echo "步骤 3: 构建 Docker 镜像 (sh build.sh)..."
sh ./build.sh
if [ $? -ne 0 ]; then
    echo "错误：构建 Docker 镜像失败 (sh build.sh)。"
    exit 1
fi
echo "Docker 镜像构建完成。"


# 检查容器是否在运行
echo "步骤 4: 检查并停止/移除旧容器 ${CONTAINER_NAME} (如果存在)..."
if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$ 2>/dev/null)" ]; then
    echo "容器 ${CONTAINER_NAME} 正在运行。正在停止并移除旧容器..."
    sh ./stop.sh
    if [ $? -ne 0 ]; then
        echo "停止旧容器时出错，尝试强制移除..."
        docker rm -f ${CONTAINER_NAME} > /dev/null 2>&1
    fi
    echo "旧容器 ${CONTAINER_NAME} 已处理。"
elif [ "$(docker ps -aq -f status=exited -f name=^/${CONTAINER_NAME}$ 2>/dev/null)" ]; then
    echo "发现已停止的容器 ${CONTAINER_NAME}，正在移除..."
    docker rm ${CONTAINER_NAME} > /dev/null 2>&1
    echo "已停止的容器 ${CONTAINER_NAME} 已移除。"
else
    echo "容器 ${CONTAINER_NAME} 未在运行或不存在。"
fi

# 启动新容器
echo "步骤 5: 启动新容器 (sh start.sh)..."
sh ./start.sh

# 检查启动脚本的退出状态
if [ $? -eq 0 ]; then
    echo "Quick-start 脚本执行完毕。应用现在应该可以通过 http://localhost:8080 (或其他配置的端口) 访问。"
else
    echo "启动新容器时出错 (sh start.sh)。"
    exit 1
fi

exit 0 