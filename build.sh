#!/bin/bash
IMAGE_NAME="my-timeline-app"
echo "正在构建镜像 ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .
if [ $? -ne 0 ]; then
    echo "镜像构建失败！"
    exit 1
else
    echo "镜像 ${IMAGE_NAME} 构建成功！"
    exit 0
fi 