<script setup lang="ts">
// 模拟热门文章数据
const popularArticles = [
  {
    title: "热门文章1：Vue 3 性能优化技巧",
    summary: "探索 Vue 3 的性能优化技巧，让你的应用更加流畅。",
    link: "#"
  },
  {
    title: "热门文章2：TypeScript 在前端开发中的应用",
    summary: "了解 TypeScript 如何提升前端开发的效率和可维护性。",
    link: "#"
  }
];

// 模拟最新项目数据
const latestProjects = [
  {
    name: "项目1：个人博客系统",
    desc: "使用 Vue 3 和 TypeScript 构建的现代化博客系统。",
    link: "#"
  },
  {
    name: "项目2：在线商城",
    desc: "基于 Vue 3 和 Tailwind CSS 开发的在线商城项目。",
    link: "#"
  }
];
</script>

<template>

  <div class="rounded-2xl overflow-hidden shadow-sm">
    <img 
      src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80"
      alt="Banner"
      class="w-full h-64 object-cover"
    >
  </div>

  <div></div>

  <div class="bg-white rounded-2xl shadow-sm p-8 mb-8">
    <h1 class="text-3xl font-bold mb-4 flex items-center">
      Hi there! 
      <span class="ml-2 text-4xl">👋</span>
    </h1>
    <p class="text-gray-600 mb-4">欢迎来到我的小博客</p>
    <p class="text-gray-600">
      记录一些想记录的东西吧，如果可以留下友链，欢迎交流。
      <span class="text-2xl">😊</span>
    </p>
  </div>

  <!-- 热门文章推荐 -->
  <div class="bg-white rounded-2xl shadow-md p-8 mb-8 mt-8 hover:shadow-lg transition-shadow">
    <h2 class="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">热门文章推荐</h2>
    <ul>
      <li v-for="article in popularArticles" :key="article.title" class="mb-4 p-4 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
        <a :href="article.link" class="text-blue-600 hover:text-blue-800 font-medium">
          {{ article.title }}
        </a>
        <p class="text-gray-600 mt-2">{{ article.summary }}</p>
      </li>
    </ul>
  </div>

  <!-- 最新项目展示 -->
  <div class="bg-white rounded-2xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow">
    <h2 class="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">最新项目展示</h2>
    <ul>
      <li v-for="project in latestProjects" :key="project.name" class="mb-4 p-4 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
        <a :href="project.link" class="text-blue-600 hover:text-blue-800 font-medium">
          {{ project.name }}
        </a>
        <p class="text-gray-600 mt-2">{{ project.desc }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>    