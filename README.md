# My Timeline App

这是一个 [简要描述你的应用].

## 先决条件

*   Node.js (建议版本 v18 或更高)
*   npm (通常随 Node.js 安装) 或 yarn
*   Docker

## 本地开发

1.  **克隆仓库:**
    ```bash
    git clone <your-repo-url>
    cd my-timeline-app
    ```

2.  **安装依赖:**
    ```bash
    npm install
    # 或者
    # yarn install
    ```

3.  **启动开发服务器:**
    ```bash
    npm start
    # 或者
    # yarn start
    ```
    应用将在 `http://localhost:3000` (或其他端口) 启动，并支持热重载。

## 生产构建与 Docker 部署

此项目采用 **本地构建** + **Docker 运行** 的方式部署。

1.  **本地构建应用:**
    在项目根目录运行以下命令，生成优化后的静态文件到 `build/` 目录：
    ```bash
    npm run build
    # 或者
    # yarn build
    ```
    *重要提示:* 每次更新代码后，如果需要部署最新版本，都需要重新执行此步骤。

2.  **构建 Docker 镜像:**
    此命令会使用本地 `build/` 目录中的静态文件和 `nginx.conf` 配置来构建一个轻量级的 Nginx Docker 镜像。
    ```bash
    sh build.sh
    ```
    *注意:* 确保在运行此命令前已成功执行步骤 1 (`npm run build`)。

3.  **启动 Docker 容器:**
    使用上一步构建的镜像来启动容器。
    ```bash
    sh start.sh
    ```
    容器将在后台运行，并将应用的 80 端口映射到主机的 8080 端口。

4.  **访问应用:**
    在浏览器中打开: `http://localhost:8080`

5.  **停止 Docker 容器:**
    停止并移除正在运行的应用容器。
    ```bash
    sh stop.sh
    ```

6.  **重启 Docker 容器:**
    快速重启正在运行的应用容器 (不会重新构建镜像)。
    ```bash
    sh restart.sh
    ```

## 配置

*   **Docker 端口:** 可以在 `start.sh` 脚本中修改 `HOST_PORT` 变量来更改映射到主机的端口。
*   **Nginx 配置:** 可以在 `nginx.conf` 文件中调整 Nginx 的行为，例如缓存策略、反向代理等。
*   **(如果需要) 环境变量:** React 应用通常使用 `.env` 文件管理环境变量。确保按照 Create React App 的规则 ([https://create-react-app.dev/docs/adding-custom-environment-variables/](https://create-react-app.dev/docs/adding-custom-environment-variables/)) 进行配置。生产构建时，`REACT_APP_` 前缀的环境变量会被嵌入到静态文件中。

## 文件结构说明

```
your-project-root/
├── public/             # 静态资源模板
├── src/                # React 源码
├── build/              # !! 本地构建产物 (npm run build 后生成) !!
├── scripts/            # (可选) 存放 .sh 脚本
├── Dockerfile          # Nginx 生产环境 Docker 配置
├── nginx.conf          # Nginx 配置文件
├── package.json        # 项目依赖与脚本
├── .dockerignore       # Docker 构建忽略文件
└── README.md           # 本文档
```
