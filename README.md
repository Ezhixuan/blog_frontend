# 个人博客前端项目

## 项目介绍

这是一个使用 Vue 3、TypeScript 和 Vite 构建的现代化个人博客前端项目。项目采用组件化开发方式，结合 Tailwind CSS 和 Ant Design Vue 构建美观且响应式的用户界面。

## 技术栈

- **核心框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **UI 框架**：Ant Design Vue
- **CSS 框架**：Tailwind CSS
- **Markdown 编辑器**：v-md-editor
- **HTTP 请求**：Axios
- **代码高亮**：Prism.js 和 Highlight.js

## 环境变量配置

### 环境变量文件

项目使用以下环境变量文件管理不同环境的配置：

- `.env`：所有环境都会加载的默认环境变量
- `.env.development`：开发环境特定的环境变量（运行`npm run dev`时加载）
- `.env.production`：生产环境特定的环境变量（运行`npm run build`时加载）
- `.env.local`：本地环境变量，会覆盖上述文件中的值（不应提交到版本控制系统）
- `.env.development.local`：本地开发环境变量（不应提交到版本控制系统）
- `.env.production.local`：本地生产环境变量（不应提交到版本控制系统）

加载优先级（从高到低）：

```
.env.{mode}.local > .env.{mode} > .env.local > .env
```

### 环境变量命名规则

为了在客户端代码中访问环境变量，变量名必须以`VITE_`开头，例如：

```
VITE_APP_API_BASE_URL=http://localhost:3000/api
```

### 可用的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| VITE_APP_TITLE | 应用名称 | 个人博客 |
| VITE_APP_API_BASE_URL | API基础URL | http://localhost:3000/api |
| VITE_APP_DEBUG | 是否启用调试模式 | false |
| VITE_APP_ENV | 当前环境标识 | development/production |
| VITE_PORT | 开发服务器端口 | 5173 |

### 使用方法

#### 直接访问

在代码中可以通过`import.meta.env`直接访问环境变量：

```typescript
const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;
```

#### 使用工具函数

项目提供了一系列工具函数，位于`src/utils/env.ts`，用于更方便地访问环境变量：

```typescript
import { getApiBaseUrl, isDebugMode } from '@/utils/env';

const apiBaseUrl = getApiBaseUrl();
if (isDebugMode()) {
  console.log('当前API地址:', apiBaseUrl);
}
```

## 项目结构

```
├── public/                 # 静态资源目录
│   ├── images/             # 图片资源
│   └── vite.svg            # Vite logo
├── src/                    # 源代码目录
│   ├── api/                # API 接口定义
│   ├── assets/             # 项目资源文件
│   ├── components/         # 公共组件
│   ├── composables/        # 组合式函数
│   ├── router/             # 路由配置
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   └── style.css           # 全局样式
├── .env                    # 默认环境变量
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── index.html              # HTML 模板
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 项目说明文档
```

## 安装和运行

### 前置条件

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式运行

```bash
npm run dev
# 或
yarn dev
```

默认情况下，开发服务器会在 http://localhost:5173 启动。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

## 主要功能

### 博客功能

- 博客文章列表展示
- 文章详情页面
- 按标签筛选文章
- 热门文章推荐
- Markdown 编辑器支持

### 用户功能

- 用户注册和登录
- 个人信息管理
- 密码修改

### 其他功能

- 项目展示
- 友情链接
- 联系页面
- 暗色/亮色主题切换

## 开发指南

### 添加新页面

1. 在 `src/views` 目录下创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加新的路由配置

```typescript
import NewPage from '../views/NewPage.vue'

// 在 routes 数组中添加
{
  path: '/new-page',
  name: 'NewPage',
  component: NewPage
}
```

### 添加新 API

1. 在 `src/api/types.ts` 中定义相关的接口类型
2. 在 `src/api` 目录下创建或修改相应的 API 文件

```typescript
import request from '../utils/request'
import { ApiResponse, NewDataType } from './types'

export function fetchNewData(params) {
  return request<ApiResponse<NewDataType>>({
    url: '/api/new-endpoint',
    method: 'get',
    params,
  })
}
```

### 环境变量配置

如需添加新的环境变量：

1. 在相应的 `.env` 文件中添加变量（记得以 `VITE_` 开头）
2. 在 `src/types/env.d.ts` 中更新 `ImportMetaEnv` 接口
3. 如有必要，在 `src/utils/env.ts` 中添加相应的工具函数

## 最佳实践

1. 使用组合式 API (Composition API) 和 `<script setup>` 语法
2. 将可复用的逻辑提取到 `composables` 目录下的组合式函数中
3. 使用 TypeScript 类型定义确保类型安全
4. 遵循 Vue 3 的风格指南
5. 使用环境变量管理不同环境的配置
6. 不要在环境变量文件中存储敏感信息，特别是会提交到版本控制系统的文件

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

[MIT](LICENSE)
