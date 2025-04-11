# My Timeline App

这是一个 [简要描述你的应用].

## 先决条件

* Node.js (建议版本 v18 或更高)
* npm (通常随 Node.js 安装) 或 yarn
* Docker

## 本地开发

1. **克隆仓库:**

   ```bash
   git clone <your-repo-url>
   cd my-timeline-app
   ```
2. **安装依赖:**

   ```bash
   npm install
   # 或者
   # yarn install
   ```
3. **启动开发服务器:**

   ```bash
   npm start
   # 或者
   # yarn start
   ```

   应用将在 `http://localhost:3000` (或其他端口) 启动，并支持热重载。

## 生产构建与 Docker 部署

此项目采用 **本地构建** + **Docker 运行** 的方式部署。

1. **本地构建应用:**
   在项目根目录运行以下命令，生成优化后的静态文件到 `build/` 目录：

   ```bash
   npm run build
   # 或者
   # yarn build
   ```

   *重要提示:* 每次更新代码后，如果需要部署最新版本，都需要重新执行此步骤。
2. **构建 Docker 镜像:**
   此命令会使用本地 `build/` 目录中的静态文件和 `nginx.conf` 配置来构建一个轻量级的 Nginx Docker 镜像。

   ```bash
   sh build.sh
   ```

   *注意:* 确保在运行此命令前已成功执行步骤 1 (`npm run build`)。
3. **启动 Docker 容器:**
   使用上一步构建的镜像来启动容器。

   ```bash
   sh start.sh
   ```

   容器将在后台运行，并将应用的 80 端口映射到主机的 8080 端口。
4. **访问应用:**
   在浏览器中打开: `http://localhost:8080`
5. **停止 Docker 容器:**
   停止并移除正在运行的应用容器。

   ```bash
   sh stop.sh
   ```
6. **重启 Docker 容器:**
   快速重启正在运行的应用容器 (不会重新构建镜像)。

   ```bash
   sh restart.sh
   ```

## 配置

* **Docker 端口:** 可以在 `start.sh` 脚本中修改 `HOST_PORT` 变量来更改映射到主机的端口。
* **Nginx 配置:** 可以在 `nginx.conf` 文件中调整 Nginx 的行为，例如缓存策略、反向代理等。
* **(如果需要) 环境变量:** React 应用通常使用 `.env` 文件管理环境变量。确保按照 Create React App 的规则 ([https://create-react-app.dev/docs/adding-custom-environment-variables/](https://create-react-app.dev/docs/adding-custom-environment-variables/)) 进行配置。生产构建时，`REACT_APP_` 前缀的环境变量会被嵌入到静态文件中。

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

## API 文档

### 获取时间轴数据

* **URL:** `/api/timeline`
* **Method:** `GET`
* **成功响应:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    [
      {
        "date": "string",  // 例如 "2023-01-15" 或 "未来"
        "title": "string",
        "description": "string"
      },
      // ... more timeline items
    ]
    ```
* **错误响应:**
  * **Code:** `500 Internal Server Error`
  * **Content:** `{ "error": "Error message description" }`

### 新增时间轴条目

* **URL:** `/api/timeline`
* **Method:** `POST`
* **请求体 (Request Body):**
  ```json
  {
    "date": "string",  // 格式: "YYYY-MM-DD" 或 "未来"
    "title": "string",
    "description": "string"
  }
  ```
* **成功响应:**
  * **Code:** `201 Created`
  * **Content:**
    ```json
    {
      "id": "string",  // 新创建条目的唯一标识符
      "date": "string",
      "title": "string",
      "description": "string",
      "createdAt": "string"  // ISO 格式的时间戳
    }
    ```
* **错误响应:**
  * **Code:** `400 Bad Request`
  * **Content:** `{ "error": "Invalid input data" }`
  * **Code:** `500 Internal Server Error`
  * **Content:** `{ "error": "Error message description" }`

## API 文档 - 日记 (Diary)

API 基础路径: `[REACT_APP_API_BASE_URL]` (例如: `https://api.love.goree.tech`)

### 1. 获取指定月份日记存在状态

获取某年某月哪些天存在日记记录。

- **URL:** `/api/diary/month-status`
- **方法:** `GET`
- **查询参数:**
  - `year` (number, 必需): 年份 (e.g., 2024)
  - `month` (number, 必需): 月份 (1-12) (e.g., 7)
- **成功响应 (200 OK):**
  - **内容类型:** `application/json`
  - **响应体:** `number[]` - 包含当月有日记的日期（日）的数组。

  ```json
  [5, 12, 25]
  ```
- **错误响应:**
  - `400 Bad Request`: 参数缺失或无效。
  - `500 Internal Server Error`: 服务器错误。

### 2. 获取指定日期日记详情

获取某一天的详细日记内容。

- **URL:** `/api/diary/entry`
- **方法:** `GET`
- **查询参数:**
  - `date` (string, 必需): 日期，格式 'YYYY-MM-DD' (e.g., "2024-07-12")
- **成功响应 (200 OK):**
  - **内容类型:** `application/json`
  - **响应体:** 日记对象。

  ```json
  {
    "date": "YYYY-MM-DD",
    "title": "日记标题",
    "content": "日记内容...",
    "mood": "心情标识符"
  }
  ```
- **错误响应:**
  - `404 Not Found`: 指定日期无日记。
  - `400 Bad Request`: `date` 参数缺失或格式错误。
  - `500 Internal Server Error`: 服务器错误。

### 3. 创建日记条目

为指定日期创建一个新的日记条目。如果该日期已有日记，则操作失败。

- **URL:** `/api/diary/entry`
- **方法:** `POST`
- **请求体 (Content-Type: application/json):**
  ```json
  {
    "date": "YYYY-MM-DD", // 必需
    "title": "日记标题",     // 必需
    "content": "日记内容...", // 必需
    "mood": "心情标识符"    // 必需
  }
  ```
- **成功响应 (201 Created):**
  - **内容类型:** `application/json`
  - **响应体:** 创建成功的日记对象 (可能包含 ID)。

  ```json
  {
    "id": "backend-generated-id", // 可选
    "date": "YYYY-MM-DD",
    "title": "日记标题",
    "content": "日记内容...",
    "mood": "心情标识符"
  }
  ```
- **错误响应:**
  - `400 Bad Request`: 请求体无效或缺少字段。
  - `409 Conflict`: 该日期的日记已存在。
  - `500 Internal Server Error`: 服务器错误。

### 4. 更新日记条目

更新指定日期的现有日记条目。

- **URL:** `/api/diary/entry/{date}`
- **方法:** `PUT`
- **路径参数:**
  - `date` (string, 必需): 要更新的日记日期 (YYYY-MM-DD)。
- **请求体 (Content-Type: application/json):** 包含更新字段的完整日记信息 (除了日期)。
  ```json
  {
    "title": "更新后的标题",   // 必需
    "content": "更新后的内容", // 必需
    "mood": "更新后的心情"    // 必需
  }
  ```
- **成功响应 (200 OK):**
  - **内容类型:** `application/json`
  - **响应体:** 更新后的完整日记对象。

  ```json
  {
    "id": "backend-generated-id", // 可选
    "date": "YYYY-MM-DD", // 从 URL 获取
    "title": "更新后的标题",
    "content": "更新后的内容",
    "mood": "更新后的心情"
  }
  ```
- **错误响应:**
  - `400 Bad Request`: 请求体无效或缺少字段。
  - `404 Not Found`: 指定日期的日记不存在。
  - `500 Internal Server Error`: 服务器错误。

## API 文档 - 认证 (Authentication)

本应用使用基于口令的 Token 认证来识别用户并控制访问。

**认证流程:**

1. **用户登录:** 前端将用户输入的口令发送到 `POST /api/login` 接口。
2. **后端验证:** 服务器验证口令。
   * 口令 `111` 对应身份 `flisa`。
   * 口令 `222` 对应身份 `goree`。
   * 其他口令无效。
3. **Token 生成:** 验证通过后，服务器生成 JWT (JSON Web Token)，包含用户身份 (`identity`) 和过期时间。
4. **Token 下发:** 服务器将 JWT 返回给前端。
5. **前端存储:** 前端将 Token 存储在本地 (例如 `localStorage`)。
6. **后续请求:** 前端在访问受保护接口时，在 `Authorization` 请求头中携带 Token (`Bearer <token>`)。
7. **后端验证 Token:** 服务器验证请求头中的 Token 是否有效（签名、过期时间）。
8. **访问控制:** 根据 Token 中的身份信息处理请求。无效或缺失 Token 将导致 `401 Unauthorized` 错误。

**重要提示:** 当前实现基于简单的口令，且用户身份信息直接包含在前端可解析的 JWT 中。这是一种 **低安全级别** 的认证，适用于内部或个人项目。对于生产环境或需要更高安全性的应用，应考虑更健壮的认证机制（如 OAuth2、密码哈希存储等）。

### 1. 用户登录

- **Endpoint:** `POST /api/login`
- **描述:** 使用口令进行登录，获取认证 Token。
- **请求体 (Request Body - `application/json`):**
  ```json
  {
    "passphrase": "用户输入的口令" 
  }
  ```
- **成功响应 (200 OK):**
  ```json
  {
    "token": "生成的 JWT 字符串",
    "identity": "flisa" // 或 "goree"
  }
  ```
- **失败响应 (401 Unauthorized):** 口令无效。
  ```json
  {
    "error": "无效的口令" 
  }
  ```
- **失败响应 (400 Bad Request):** 请求体格式错误。
  ```json
  {
      "error": "请求体缺少 passphrase 字段"
  }
  ```

### 2. 访问受保护接口

- **Endpoint:** 所有需要登录才能访问的 API 接口 (例如 `/api/diaries`, `/api/timeline` 等，根据实际需要配置)。
- **描述:** 需要在请求头中提供有效的认证 Token。
- **请求头 (Request Headers):**
  ```
  Authorization: Bearer <从登录接口获取的Token>
  ```
- **成功响应 (200 OK):**
  * 返回接口预期的业务数据。

* **失败响应 (401 Unauthorized):** Token 缺失、无效或过期。

  ```json
  {
    "error": "需要认证" 
  }
  ```

  或
*  ```json
  {
    "error": "Token已过期"
  }
  ```


## API 文档 - 访问日志 (Access Log)

### 1. 查询访问日志

- **Endpoint:** `/api/access-log`
- **方法:** `GET`
- **描述:** 查询用户访问日志记录。
- **查询参数 (Query Parameters):**
  - `since` (string, 可选): 起始时间 (ISO 8601 格式, 例如: `2024-07-30T10:00:00Z`)。如果未提供，默认为当天开始时间。
  - `until` (string, 可选): 结束时间 (ISO 8601 格式)。如果未提供，默认为当前时间。
  - `identity` (string, 可选): 按指定的用户身份过滤 (例如: `flisa`)。如果未提供，则返回所有用户的记录。
- **成功响应 (200 OK):**
  - **内容类型:** `application/json`
  - **响应体:** 一个包含访问记录对象的数组。
    ```json
    [
      {
        "identity": "flisa",
        "timestamp": "2024-07-30T10:15:30Z"
      },
      {
        "identity": "goree",
        "timestamp": "2024-07-30T11:05:00Z"
      }
      // ...更多记录
    ]
    ```
- **错误响应:**
  - `400 Bad Request`: 查询参数格式错误 (例如，无效的日期时间格式)。
    ```json
    {
      "error": "无效的时间格式"
    }
    ```
  - `401 Unauthorized`: 需要认证但未提供有效 Token 或 Token 过期。
  - `500 Internal Server Error`: 服务器内部错误。
