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

  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
    <h1 class="text-3xl font-bold mb-4 flex items-center dark:text-white">
      Hi there! 
      <span class="ml-2 text-4xl">👋</span>
    </h1>
    <p class="text-gray-600 dark:text-gray-300 mb-4">欢迎来到我的小博客</p>
    <p class="text-gray-600 dark:text-gray-300">
      记录一些想记录的东西吧，如果可以留下友链，欢迎交流。
      <span class="text-2xl">😊</span>
    </p>
  </div>

  <!-- 热门文章推荐 -->
  <div class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md p-8 mb-8 mt-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">热门文章推荐</span>
      <div class="flex-grow border-b-2 border-gray-200 dark:border-gray-700 ml-4"></div>
    </h2>
    <div class="grid gap-6">
      <div v-for="article in popularArticles" :key="article.title" 
           class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="flex-grow">
            <a :href="article.link" class="block group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors duration-300">
              <h3 class="font-semibold text-lg mb-2">{{ article.title }}</h3>
            </a>
            <p class="text-gray-600 dark:text-gray-300 text-sm">{{ article.summary }}</p>
            <div class="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                5分钟阅读
              </span>
              <span class="mx-2">•</span>
              <span>2024-01-20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 最新项目展示 -->
  <div class="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md p-8 mb-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">最新项目展示</span>
      <div class="flex-grow border-b-2 border-gray-200 dark:border-gray-700 ml-4"></div>
    </h2>
    <div class="grid gap-6">
      <div v-for="project in latestProjects" :key="project.name" 
           class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-grow">
            <a :href="project.link" class="block group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400 transition-colors duration-300">
              <h3 class="font-semibold text-lg mb-2">{{ project.name }}</h3>
            </a>
            <p class="text-gray-600 dark:text-gray-300 text-sm">{{ project.desc }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">Vue 3</span>
              <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">TypeScript</span>
              <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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