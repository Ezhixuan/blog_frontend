# Sidebar 组件重构文档

## 1. 概述

当前 `Sidebar.vue` 组件功能过于庞大和复杂，将用户认证、信息展示、主导航、文章目录、分类/标签列表、多个模态框等多种不相关的功能杂糅在一起。这种设计违反了单一职责原则，导致组件难以阅读、维护和扩展。

本次重构的目标是遵循企业级开发标准，将 `Sidebar.vue` 拆分为多个独立的、功能单一的子组件和可复用的逻辑单元 (Composables)，以提升代码的可读性、可维护性和可复用性。

## 2. 模块拆分方案

我们将在 `XuanBlog_Frontend/src/components/layout/Sidebar/` 目录下创建一个 `modules` 子目录，用于存放所有从 `Sidebar.vue` 拆分出来的子组件。

### 2.1. 子组件 (Components)

| 组件名 | 存放路径 | 核心职责 |
| :--- | :--- | :--- |
| `UserProfile.vue` | `modules/UserProfile.vue` | 管理用户头像、昵称的展示，以及登录/未登录状态下的信息悬浮窗（包括登录注册引导、用户详细信息、操作按钮等）。 |
| `MainMenu.vue` | `modules/MainMenu.vue` | 负责渲染主导航菜单，并处理菜单项的点击、路由跳转以及子菜单（如博客分类）的展开/折叠逻辑。 |
| `ArticleToc.vue` | `modules/ArticleToc.vue` | 在文章详情页，负责展示文章目录（TOC），并包含返回博客列表、返回首页的快捷导航。 |
| `TaxonomyList.vue` | `modules/TaxonomyList.vue` | 一个可复用的组件，用于展示分类（Categories）和标签（Tags）列表。通过 `prop` 区分类型。 |
| `SidebarFooter.vue` | `modules/SidebarFooter.vue` | 包含社交链接（GitHub, Twitter等）和主题切换按钮。 |
| `EditUserInfoModal.vue` | `modules/EditUserInfoModal.vue` | 独立的模态框组件，负责处理用户编辑个人资料的表单和逻辑。 |
| `PictureSelectModal.vue`| `modules/PictureSelectModal.vue`| 独立的模态框组件，负责展示图片列表、支持用户选择或上传新图片作为头像。 |

### 2.2. 逻辑抽象 (Composables)

为了进一步净化组件逻辑，我们会将可复用的逻辑抽离到 `src/composables/` 目录下。

| Composable 名称 | 存放路径 | 核心职责 |
| :--- | :--- | :--- |
| `useTaxonomy.ts` | `src/composables/useTaxonomy.ts` | 封装获取分类和标签列表的逻辑，包括加载状态和数据缓存。 |
| `useAvatar.ts` | `src/composables/useAvatar.ts` | 封装与头像管理相关的逻辑，包括触发上传、处理图片选择、调用更新接口等。 |

## 3. 重构后的 `Sidebar.vue`

经过重构，`Sidebar.vue` 将转变为一个“布局”或“容器”组件。其主要职责包括：

1.  **维持侧边栏框架**：提供 `aside` 根元素，处理移动端的展开/收起状态。
2.  **条件渲染**：根据当前路由判断应该显示主导航视图 (`MainMenu`, `TaxonomyList` 等) 还是文章目录视图 (`ArticleToc`)。
3.  **组装模块**：按顺序引入并渲染上述拆分出的子组件。

其自身的 `<script>` 和 `<template>` 部分将变得极为简洁清晰。

---
接下来，我将根据此方案逐步进行代码的拆分和重构。
