<template>
  <div class="article-container">
    <div class="reading-progress-container">
      <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
    </div>

    <div class="article-layout">
      <div class="back-button-container">
        <button class="back-button" @click="handleBackToList" aria-label="返回文章列表">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>返 回</span>
        </button>
      </div>

      <div class="article-main">
        <div class="article-card">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>正在加载文章...</p>
          </div>

          <div v-else-if="article">
            <h1 class="article-title">{{ article.title }}</h1>

            <div class="article-meta">
              <span>{{ formatDate(article.createTime) }}</span>
              <span class="meta-separator">•</span>
              <span>{{ article.wordCount || 0 }} 字</span>
              <span class="meta-separator">•</span>
              <span>{{ article.viewCount || 0 }} 次阅读</span>
              <span class="meta-separator">•</span>
              <a href="javascript:void(0)" class="meta-category">{{ article.categoryName }}</a>

              <span v-if="isAuthor" class="ml-auto">
                <button @click="handleEditArticle" class="edit-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  编辑文章
                </button>
              </span>
            </div>

            <div v-if="article.tagMap && Object.keys(article.tagMap).length > 0" class="article-tags">
              <div v-for="(value, key) in article.tagMap" :key="key" class="article-tag">
                {{ value }}
              </div>
            </div>

            <div class="article-content">
              <div v-if="article.summary" class="article-summary">
                {{ article.summary }}
              </div>

              <MarkdownPreview 
                v-if="article.content" 
                :content="article.content" 
                @content-updated="handleContentUpdated"
                ref="markdownPreviewRef" 
              />

              <p v-if="!article.content" class="no-content-tip">文章详情内容暂未提供</p>
            </div>

            <div class="article-actions">
              <button class="action-btn like-btn" @click="handleThumb">
                <span>点赞</span>
                <span>{{ article.likeCount || 0 }}</span>
              </button>

              <button v-if="isAuthor" @click="handleEditArticle" class="action-btn edit-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>编辑文章</span>
              </button>
            </div>
          </div>

          <div v-else class="article-not-found">
            <h2>文章不存在或已被删除</h2>
            <button class="back-btn" @click="goBack">返回文章列表</button>
          </div>
        </div>
      </div>
      
      <div v-if="article && article.content" class="toc-container">
        <div v-if="isMobile" class="toc-mobile-trigger" @click="toggleToc">
          <span>文章目录</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div :class="['toc-wrapper', { 'show': showToc || !isMobile }]">
          <Toc v-if="article && article.content" :content="renderedContent" ref="tocComponentRef" />
        </div>
      </div>
    </div>
    <BackToTop :visibility-height="300" :duration="500" />

    <!-- 图片预览组件 -->
    <ImageViewer v-model:visible="previewVisible" :image-url="previewImageUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleInfo, doThumb } from '../api/articleController';
import BackToTop from '../components/BackToTop.vue';
import ImageViewer from '../components/ImageViewer.vue';
import Toc from '../components/Toc.vue';  // 引入Toc组件
import 'md-editor-v3/lib/style.css';
import { useUserStore } from '@/stores/user';
import { getPageState } from '@/utils/pageMemory';
import 'md-editor-v3/lib/preview.css';
import MarkdownPreview from '@/components/MarkdownPreview.vue';
import messageService from '@/utils/message';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const articleId = ref<string | null>(null);
const article = ref<any>(null);
const loading = ref(true);
const readingProgress = ref(0);
const markdownPreviewRef = ref<any>(null);
const tocComponentRef = ref<any>(null);
const renderedContent = ref('');
const showToc = ref(false);

let scrollThrottleTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const isAuthor = computed(() => userStore.userInfo?.id === article.value?.userId);
const isMobile = computed(() => window.innerWidth < 768);

const previewVisible = ref(false);
const previewImageUrl = ref('');

const goBack = () => router.back();
const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('zh-CN') : '';

const handleThumb = async () => {
  if (!article.value || !articleId.value) return;
  const res = await doThumb({ id: articleId.value });
  console.log("res", res);
  if (res.data.code === 0) {
    article.value.likeCount = res.data.data ? article.value.likeCount + 1 : article.value.likeCount - 1;
  } else {
    messageService.error(res.data.message || '点赞失败');
  }
}

const handleEditArticle = () => {
  if (!article.value) return;
  router.push({
    path: '/blog/edit',
    query: { id: articleId.value }
  });
};

const handleContentUpdated = (content: string) => {
  renderedContent.value = content;
  
  // 使用nextTick确保组件更新后再更新目录
  nextTick(() => {
    // 如果目录组件存在，延迟一点尝试强制更新目录
    setTimeout(() => {
      if (tocComponentRef.value && typeof tocComponentRef.value.generateTOCFromDOM === 'function') {
        tocComponentRef.value.generateTOCFromDOM();
      }
    }, 500);
  });
};

const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  } as T;
};

const fetchArticleDetail = async (id: string) => {
  try {
    loading.value = true;
    const res = await getArticleInfo({ id });
    article.value = res.data?.data || null;
  } catch (error) {
    article.value = null;
  } finally {
    loading.value = false;
  }
};

const calculateReadingProgress = () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  readingProgress.value = Math.min(100, Math.max(0, (scrollTop / (scrollHeight - clientHeight)) * 100));
};

const toggleToc = () => {
  showToc.value = !showToc.value;
};

const handleBackToList = () => {
  const pageState = getPageState();

  if (pageState) {
    const query: Record<string, string> = {
      page: pageState.current.toString(),
      pageSize: pageState.pageSize.toString()
    };

    if (pageState.categoryId) query.categoryId = pageState.categoryId;
    if (pageState.tagId) query.tagId = pageState.tagId;

    router.push({
      path: '/blogs',
      query
    });
    if (pageState.scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: pageState.scrollPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  } else {
    router.push('/blogs');
  }
};

const openPreview = (imageUrl: string) => {
  previewImageUrl.value = imageUrl;
  previewVisible.value = true;
};

const handleImageClick = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target.classList.contains('md-editor-v3-img')) {
    e.preventDefault();
    openPreview(target.src);
  }
};

const handleScroll = throttle(() => {
  calculateReadingProgress();
}, 100);

// 提供阅读进度给Toc组件
provide('readingProgress', readingProgress);

onMounted(() => {
  const id = route.params.id;
  if (id && typeof id === 'string') {
    articleId.value = id;
    fetchArticleDetail(id);
  }

  // 添加图片点击事件监听
  document.addEventListener('click', handleImageClick);

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (!isMobile.value) {
      showToc.value = true;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
  document.removeEventListener('click', handleImageClick);
  if (scrollThrottleTimeout.value) {
    clearTimeout(scrollThrottleTimeout.value);
    scrollThrottleTimeout.value = null;
  }
});
</script>

<style scoped>
.article-container {
  @apply w-[85%] md:w-[80%] lg:w-[75%] mx-auto px-4 py-8;
}

.reading-progress-container {
  @apply fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-700;
}

.reading-progress-bar {
  @apply h-full bg-blue-600 dark:bg-blue-500 transition-all duration-200;
}

.article-layout {
  @apply flex flex-col md:flex-row;
}

.article-main {
  @apply flex-[3] w-full;
}

.article-card {
  @apply bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 transition-all duration-300;
}

.article-title {
  @apply text-3xl font-bold text-gray-900 dark:text-white mb-4;
}

.article-meta {
  @apply flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-6;
}

.meta-separator {
  @apply mx-2;
}

.meta-category {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.article-tags {
  @apply flex flex-wrap gap-2 mb-6;
}

.article-tag {
  @apply px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium;
}

.article-content {
  @apply text-gray-800 dark:text-gray-200 leading-relaxed;
}

.article-summary {
  @apply p-4 bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-600 rounded mb-6 text-gray-600 dark:text-gray-300 italic;
}

.article-actions {
  @apply flex justify-center mt-12 pt-6 border-t border-gray-100 dark:border-gray-700;
}

.action-btn {
  @apply flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200;
}

.like-btn {
  @apply bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400;
}

.edit-action-btn {
  @apply ml-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400;
}

.loading-indicator {
  @apply flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mb-4;
}

.article-not-found {
  @apply text-center py-12;
}

.article-not-found h2 {
  @apply text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4;
}

.back-btn {
  @apply px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors;
}

.edit-button {
  @apply flex items-center text-xs font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-300;
}

.no-content-tip {
  @apply text-center py-8 text-gray-500 dark:text-gray-400 italic;
}

/* TOC 样式 */
.toc-container {
  @apply hidden md:block flex-1 ml-6;
  position: relative;
  min-width: 200px;
  max-width: 280px;
}

.toc-wrapper {
  position: sticky;
  top: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark .toc-wrapper {
  background: rgba(26, 32, 44, 0.95);
  border-color: rgba(255, 255, 255, 0.05);
}

/* 移动端样式 */
.toc-mobile-trigger {
  display: none;
}

@media (max-width: 768px) {
  .toc-container {
    @apply block w-full mt-4 mx-0;
    max-width: none;
  }
  
  .toc-mobile-trigger {
    display: flex;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    margin-bottom: 10px;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 15px;
  }
  
  .dark .toc-mobile-trigger {
    background: rgba(26, 32, 44, 0.95);
    color: #e2e8f0;
  }
  
  .toc-wrapper {
    display: none;
    position: relative;
    top: 0;
  }
  
  .toc-wrapper.show {
    display: block;
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  color: #2c3e50;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.back-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  width: calc(100% - 32px);
  height: 1px;
  background-color: #2c3e50;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.back-button:hover {
  color: #1a73e8;
}

.back-button:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.back-button svg {
  transition: transform 0.3s ease;
  color: #7f8c8d;
}

.back-button:hover svg {
  transform: translateX(-4px);
  color: #1a73e8;
}

/* md-editor-v3 容器样式调整 */
:deep(.md-editor-v3) {
  @apply bg-transparent;
}

:deep(.md-editor-v3-content-wrapper) {
  @apply bg-transparent;
}

:deep(.md-editor-v3-preview) {
  @apply bg-transparent p-0;
}

:deep(.md-editor-v3-html) {
  @apply bg-transparent;
}

/* 响应式调整 md-editor-v3 */
@media (max-width: 768px) {
  :deep(.md-editor-v3) {
    @apply rounded-none;
  }

  :deep(.md-editor-v3-preview) {
    @apply px-0;
  }
}
</style>