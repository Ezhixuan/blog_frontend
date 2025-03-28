<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 轮播图配置
const banners = [
  '/public/images/local-banner1.jpg',
  '/public/images/local-banner2.jpg'
];
const currentIndex = ref(0);
const timer = ref<number | null>(null);

// 自动轮播
const startAutoPlay = () => {
  timer.value = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.length;
  }, 10000);
};

// 停止轮播
const stopAutoPlay = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

// 手动切换轮播图
const switchBanner = (index: number) => {
  currentIndex.value = index;
  stopAutoPlay();
  startAutoPlay();
};

// 组件挂载时启动轮播
onMounted(() => {
  startAutoPlay();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoPlay();
});

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

  <div class="rounded-2xl overflow-hidden shadow-sm h-[25vh] relative mb-8 group">
    <div class="relative w-full h-full">
      <transition-group name="fade">
        <img 
          v-for="(banner, index) in banners" 
          :key="banner"
          :src="banner"
          :alt="`Banner ${index + 1}`"
          v-show="currentIndex === index"
          class="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500"
        >
      </transition-group>

      <!-- 轮播指示器 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        <button 
          v-for="(_, index) in banners" 
          :key="index"
          @click="switchBanner(index)"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'"
        ></button>
      </div>

      <!-- 左右切换按钮 -->
      <button 
        @click="switchBanner((currentIndex - 1 + banners.length) % banners.length)"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        @click="switchBanner((currentIndex + 1) % banners.length)"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>