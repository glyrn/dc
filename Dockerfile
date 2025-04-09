# --- Stage 1: Nginx Runtime ---
FROM nginx:stable-alpine as production

# Nginx 配置
ARG NGINX_CONF_FILE=nginx.conf
COPY ${NGINX_CONF_FILE} /etc/nginx/conf.d/default.conf

# 静态文件存放路径
ARG BUILD_PATH=build
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./${BUILD_PATH}/ .

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"] 