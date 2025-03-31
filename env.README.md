# 环境变量配置说明

## 概述

本项目使用环境变量来管理不同环境（开发、测试、生产）的配置。Vite原生支持通过`.env`文件加载环境变量，无需额外的依赖。

## 环境变量文件

项目中包含以下环境变量文件：

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

## 环境变量命名规则

为了在客户端代码中访问环境变量，变量名必须以`VITE_`开头，例如：

```
VITE_APP_API_BASE_URL=http://localhost:3000/api
```

## 使用方法

### 直接访问

在代码中可以通过`import.meta.env`直接访问环境变量：

```typescript
const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;
```

### 使用工具函数

项目提供了一系列工具函数，位于`src/utils/env.ts`，用于更方便地访问环境变量：

```typescript
import { getApiBaseUrl, isDebugMode } from '@/utils/env';

const apiBaseUrl = getApiBaseUrl();
if (isDebugMode()) {
  console.log('当前API地址:', apiBaseUrl);
}
```

## 本地开发配置

如果需要在本地覆盖某些环境变量，可以创建`.env.local`或`.env.development.local`文件，例如：

```
# .env.development.local
VITE_APP_API_BASE_URL=http://localhost:8080/api
```

**注意**：`.env.*.local`文件不应提交到版本控制系统，它们已被添加到`.gitignore`中。

## 可用的环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| VITE_APP_TITLE | 应用名称 | 个人博客 |
| VITE_APP_API_BASE_URL | API基础URL | http://localhost:3000/api |
| VITE_APP_DEBUG | 是否启用调试模式 | false |
| VITE_APP_ENV | 当前环境标识 | development/production |
| VITE_PORT | 开发服务器端口 | 5173 |

## 最佳实践

1. 不要在环境变量文件中存储敏感信息（如API密钥、密码等），特别是会提交到版本控制系统的文件
2. 对于敏感信息，使用`.env.local`文件或系统环境变量
3. 为了更好的类型支持，在`src/types/env.d.ts`中定义了环境变量的类型
4. 使用`src/utils/env.ts`中提供的工具函数访问环境变量，而不是直接使用`import.meta.env`