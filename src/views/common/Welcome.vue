<template>
  <!-- 轮播图区域 - 调整高度和样式 -->
  <div
    class="rounded-3xl overflow-hidden shadow-lg h-[40vh] min-h-[300px] relative mb-12 group bg-gradient-to-r from-blue-600 to-purple-600"
  >
    <div class="relative w-full h-full">
      <transition-group name="fade">
        <img
          v-for="(banner, index) in banners"
          :key="banner"
          :src="banner"
          :alt="`Banner ${index + 1}`"
          v-show="currentIndex === index"
          class="w-full h-full object-cover object-center absolute inset-0 transition-all duration-700"
        />
      </transition-group>

      <!-- 遮罩层增强视觉效果 -->
      <div class="absolute inset-0 bg-black/20"></div>

      <!-- 轮播指示器 -->
      <div
        class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10"
      >
        <button
          v-for="(_, index) in banners"
          :key="index"
          @click="switchBanner(index)"
          class="h-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          :class="
            currentIndex === index
              ? 'bg-white w-8 shadow-lg'
              : 'bg-white/60 hover:bg-white/80 w-3'
          "
        ></button>
      </div>

      <!-- 左右切换按钮 - 重新设计 -->
      <button
        @click="
          switchBanner((currentIndex - 1 + banners.length) % banners.length)
        "
        class="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="switchBanner((currentIndex + 1) % banners.length)"
        class="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- 欢迎语部分 - 重新设计 -->
  <div class="relative overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 opacity-60"
    ></div>
    <div
      class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 mb-12 border border-white/50 dark:border-gray-700/50"
    >
      <div class="text-center">
        <h1
          class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Hi there!
          <span class="inline-block animate-bounce">👋</span>
        </h1>
        <p class="text-xl text-gray-700 dark:text-gray-200 mb-4 font-medium">
          欢迎来到我的小博客
        </p>
        <p
          class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
        >
          记录一些想记录的东西吧，如果可以留下友链，欢迎交流。
          <span class="text-2xl ml-2">😊</span>
        </p>
      </div>
    </div>
  </div>

  <!-- 热门文章推荐 -->
  <div v-if="popularArticles.length > 0" class="mb-12">
    <div class="text-center mb-8">
      <h2
        class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
      >
        热门文章推荐
      </h2>
      <div
        class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"
      ></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="articlesLoading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"
      ></div>
      <span class="ml-4 text-lg text-gray-600 dark:text-gray-300"
        >加载中...</span
      >
    </div>

    <!-- 文章列表 -->
    <div v-else class="grid gap-8">
      <article
        v-for="(article, index) in popularArticles"
        :key="article.id"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-2"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- 装饰性渐变边框 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        ></div>

        <div class="relative flex items-start space-x-6">
          <div
            class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div class="flex-grow">
            <router-link
              :to="`/article/${article.id}`"
              class="block group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors duration-300"
            >
              <h3 class="font-bold text-xl mb-3 leading-tight hover:underline">
                {{ article.title }}
              </h3>
            </router-link>
            <p
              class="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6"
            >
              {{ article.summary }}
            </p>
            <div
              class="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span
                class="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ estimateReadTime(article.wordCount) }}
              </span>
              <span
                class="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(article.createTime) }}
              </span>
              <span
                class="flex items-center bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {{ article.viewCount }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>

  <!-- 最新项目展示 -->
  <div v-if="latestProjects.length > 0" class="mb-12">
    <div class="text-center mb-8">
      <h2
        class="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-4"
      >
        最新项目展示
      </h2>
      <div
        class="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mx-auto"
      ></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="projectsLoading" class="flex justify-center items-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"
      ></div>
      <span class="ml-4 text-lg text-gray-600 dark:text-gray-300"
        >加载中...</span
      >
    </div>

    <!-- 项目列表 -->
    <div v-else class="grid gap-8">
      <article
        v-for="(project, index) in latestProjects"
        :key="project.id"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:-translate-y-2"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- 装饰性渐变边框 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        ></div>

        <div class="relative flex items-start space-x-6">
          <div
            class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 dark:from-green-900 dark:via-teal-900 dark:to-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="flex-grow">
            <a
              :href="project.liveUrl || project.url"
              target="_blank"
              class="block group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400 transition-colors duration-300"
            >
              <h3 class="font-bold text-xl mb-3 leading-tight hover:underline">
                {{ project.title }}
              </h3>
            </a>
            <p
              class="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6"
            >
              {{ project.description }}
            </p>
            <div class="mb-6 flex flex-wrap gap-2">
              <span
                v-for="technology in project.technologies"
                :key="technology"
                class="px-3 py-1 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium border border-green-200 dark:border-green-700 hover:shadow-md transition-shadow duration-200"
              >
                {{ technology }}
              </span>
            </div>
            <div
              class="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"
            >
              <span
                class="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                {{ project.stars }}
              </span>
              <span
                class="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {{ project.views }}
              </span>
              <span
                class="flex items-center bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(project.createTime) }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getArticleList, getProjects } from "@/api";
import type { ArticleInfo, ProjectQueryVO } from "@/types/api";

// 轮播图配置
const banners = [
  "/public/images/local-banner1.jpg",
  "/public/images/local-banner2.jpg",
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
  fetchPopularArticles();
  fetchLatestProjects();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoPlay();
});

// 热门文章数据
const popularArticles = ref<ArticleInfo[]>([]);
const articlesLoading = ref(false);

// 获取热门文章
const fetchPopularArticles = async () => {
  try {
    articlesLoading.value = true;
    const response = await getArticleList({
      current: 1,
      pageSize: 3,
      sortOrder: "desc",
    });
    if (response.code === 0 && response.data?.data) {
      popularArticles.value = response.data.data;
    }
  } catch (error) {
    console.error("获取热门文章失败:", error);
  } finally {
    articlesLoading.value = false;
  }
};

// 最新项目数据
const latestProjects = ref<ProjectQueryVO[]>([]);
const projectsLoading = ref(false);

// 获取最新项目
const fetchLatestProjects = async () => {
  try {
    projectsLoading.value = true;
    const response = await getProjects({
      current: 1,
      pageSize: 3,
      sortOrder: "desc",
    });
    if (response.code === 0 && response.data?.data) {
      latestProjects.value = response.data.data;
    }
  } catch (error) {
    console.error("获取最新项目失败:", error);
  } finally {
    projectsLoading.value = false;
  }
};

// 格式化时间
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 估算阅读时间
const estimateReadTime = (wordCount: number) => {
  const wordsPerMinute = 200; // 假设每分钟阅读200字
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes}分钟阅读`;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* 添加入场动画 */
article {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确保backdrop-blur支持 */
@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
}

/* 优化滚动条样式（如果需要） */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}
</style>
