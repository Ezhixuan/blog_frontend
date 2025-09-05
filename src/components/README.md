# 通用组件和样式类使用指南

## StarfieldBackground 星空背景组件

### 简介
StarfieldBackground 是一个可复用的星空背景组件，包含三个层级的星星和动画效果。

### 使用方法

```vue
<template>
  <div class="page-container">
    <!-- 星空背景 - 仅在暗色模式下显示 -->
    <StarfieldBackground :show="currentTheme === 'dark'" />
    
    <!-- 其他内容 -->
    <div class="content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/utils/helpers/theme'
import StarfieldBackground from '@/components/layout/StarfieldBackground.vue'

const { currentTheme } = useTheme()
</script>
```

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| show | boolean | true | 是否显示星空背景 |

## 通用样式类

### 卡片样式类

#### .card-base
基础卡片样式，包含：
- 白色/暗色背景
- 圆角边框
- 阴影效果
- Hover 动画
- 响应式设计

**注意：** 如果需要使用发光效果，必须添加 `group` 类。

```vue
<template>
  <article class="card-base group">
    <!-- 卡片内容 -->
  </article>
</template>
```

#### 装饰性发光效果

提供三种颜色的发光效果：

- `.card-glow-blue` - 蓝色系发光效果
- `.card-glow-green` - 绿色系发光效果  
- `.card-glow-purple` - 紫色系发光效果

```vue
<template>
  <article class="card-base group">
    <!-- 装饰性发光效果 -->
    <div class="card-glow-blue"></div>
    
    <!-- 卡片内容 -->
    <div class="relative">
      <!-- 内容需要设置 relative 以确保在发光效果之上 -->
    </div>
  </article>
</template>
```

#### .gradient-title
渐变标题样式，提供蓝色到紫色到粉色的渐变效果：

```vue
<template>
  <h2 class="gradient-title">标题文本</h2>
</template>
```

### 完整示例

```vue
<template>
  <div class="page-container">
    <!-- 星空背景 -->
    <StarfieldBackground :show="isDarkMode" />
    
    <!-- 内容卡片 -->
    <article class="card-base group">
      <div class="card-glow-blue"></div>
      
      <div class="relative">
        <h2 class="gradient-title">卡片标题</h2>
        <p>卡片内容...</p>
      </div>
    </article>
    
    <article class="card-base group">
      <div class="card-glow-green"></div>
      
      <div class="relative">
        <h2 class="gradient-title">另一个卡片</h2>
        <p>更多内容...</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/utils/helpers/theme'
import StarfieldBackground from '@/components/layout/StarfieldBackground.vue'

const { currentTheme } = useTheme()
const isDarkMode = computed(() => currentTheme.value === 'dark')
</script>
```

### 样式类优势

1. **统一性** - 所有卡片使用相同的基础样式
2. **可维护性** - 样式集中管理，易于修改
3. **响应式** - 自动适配不同屏幕尺寸
4. **可扩展性** - 可以轻松添加新的颜色变体
5. **复用性** - 可在多个页面中重复使用

### 注意事项

- 使用发光效果时，需要在卡片元素上添加 `group` 类
- 使用发光效果时，内容需要设置 `relative` 类以确保层级正确
- 星空背景组件会自动设置 `z-index: -1`，不会影响其他内容
- 所有样式类都包含了移动端优化 