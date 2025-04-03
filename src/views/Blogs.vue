<template>
  <div class="blogs-container">
    <div class="blogs-wrapper">
      <h1 class="blogs-title">
        <span class="blogs-title-text">Blog Posts</span>
        <div class="blogs-title-divider"></div>
      </h1>

      <!-- 文章列表 -->
      <div class="blogs-grid">
        <article 
          v-for="article in articles" 
          :key="article.id"
          class="blog-article"
          role="article" 
          :aria-labelledby="`article-title-${article.id}`"
        >
          <div class="article-container">
            <!-- 左侧内容 - 点击查看文章 -->
            <div 
              class="article-content"
              @click="goToArticleDetail(article.id)"
            >
              <h2 
                :id="`article-title-${article.id}`"
                class="article-title"
              >
                {{ article.title }}
              </h2>
              <p class="article-summary">
                {{ article.summary || '暂无摘要' }}
              </p>
              <div class="article-meta">
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(article.createTime) }}
                </span>
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ getReadTime(article.wordCount) }} min read
                </span>
                <span class="article-category">
                  {{ article.categoryName }}
                </span>
              </div>
            </div>
            
            <!-- 斜线分隔 -->
            <div class="article-divider"></div>
            
            <!-- 右侧图片 -->
            <div 
              class="article-image-container"
              @click.stop="handleImageClick(article)"
            >
              <div v-if="article.cover" class="article-image-wrapper">
                <img 
                  :src="article.cover"
                  class="article-image"
                  :alt="article.title" 
                  loading="lazy" 
                  decoding="async" 
                />
              </div>
              <div v-else class="article-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" class="placeholder-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-container" v-if="total > 0">
        <button
          class="pagination-button"
          :disabled="pagination.current === 1" 
          @click="changePage(pagination.current - 1)" 
          aria-label="上一页"
          :aria-disabled="pagination.current === 1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>上一页</span>
        </button>
        <span class="pagination-info">{{ pagination.current }} / {{ pagination.totalPages }}</span>
        <button
          class="pagination-button"
          :disabled="pagination.current === pagination.totalPages" 
          @click="changePage(pagination.current + 1)"
          aria-label="下一页" 
          :aria-disabled="pagination.current === pagination.totalPages"
        >
          <span>下一页</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- 回到顶部按钮 -->
  <BackToTop :visibility-height="300" :duration="500" />

  <!-- 图片预览组件 -->
  <ImageViewer v-model:visible="previewVisible" :image-url="previewImageUrl" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';
import ImageViewer from '../components/ImageViewer.vue';
import BackToTop from '../components/BackToTop.vue';
import { useRouter, useRoute } from 'vue-router';
import { getArticlePageList } from '../api/articleController';
import { savePageState } from '@/utils/pageMemory';

interface ArticleQueryParams {
  current: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  categoryIds?: number[];
  tagIds?: number[];
}

const router = useRouter();
const route = useRoute();
const articles = ref<API.ArticlePageVO[]>([]);
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const previewVisible = ref(false);
const previewImageUrl = ref('');

// 计算分页信息
const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: total.value,
  totalPages: Math.ceil(total.value / pageSize.value)
}));

// 工具函数
const utils = {
  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
  },

  getReadTime(wordCount?: number): number {
    if (!wordCount) return 1;
    return Math.max(1, Math.ceil(wordCount / 200));
  },

  getQueryParams(route: any): { categoryId?: string; tagId?: string } {
    return {
      categoryId: route.query.categoryId as string | undefined,
      tagId: route.query.tagId as string | undefined
    };
  }
};

// 从URL参数中获取初始分页状态
onMounted(() => {
  const pageParam = route.query.page;
  const pageSizeParam = route.query.pageSize;

  if (pageParam && typeof pageParam === 'string') {
    const pageNumber = parseInt(pageParam);
    if (!isNaN(pageNumber)) {
      current.value = Math.max(1, pageNumber);
    }
  }

  if (pageSizeParam && typeof pageSizeParam === 'string') {
    const pageSizeNumber = parseInt(pageSizeParam);
    if (!isNaN(pageSizeNumber)) {
      pageSize.value = Math.max(1, pageSizeNumber);
    }
  }

  loadArticles();
});

// 监听路由参数变化
watch(
  [() => current.value, () => pageSize.value, () => route.query.categoryId, () => route.query.tagId],
  ([newCurrent, newPageSize, newCategoryId, newTagId], [oldCurrent, oldPageSize, oldCategoryId, oldTagId]) => {
    if (route.path !== '/blogs') return;

    const { categoryId, tagId } = utils.getQueryParams(route);
    const query: Record<string, string> = {
      page: newCurrent.toString(),
      pageSize: newPageSize.toString()
    };

    if (categoryId) query.categoryId = categoryId;
    if (tagId) query.tagId = tagId;

    router.replace({ path: '/blogs', query });
    saveCurrentPageState();

    if (newCategoryId !== oldCategoryId || newTagId !== oldTagId) {
      current.value = 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadArticles();
  },
  { flush: 'sync' }
);

// 保存当前分页状态
const saveCurrentPageState = () => {
  const { categoryId, tagId } = utils.getQueryParams(route);
  savePageState(
    current.value,
    pageSize.value,
    window.scrollY,
    categoryId,
    tagId
  );
};

// 加载文章列表
const loadArticles = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const params: ArticleQueryParams = {
      current: current.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend'
    };

    const { categoryId, tagId } = utils.getQueryParams(route);
    if (categoryId) params.categoryIds = [parseInt(categoryId)];
    if (tagId) params.tagIds = [parseInt(tagId)];

    const res = await getArticlePageList(params);

    if (res.data?.data) {
      articles.value = res.data.data.data || [];
      total.value = res.data.data.total || 0;
    } else {
      console.error('获取文章列表失败:', res.data?.message);
      articles.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('获取文章列表失败', error);
    articles.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 切换页面
const changePage = (page: number) => {
  if (current.value === page || loading.value) return;
  current.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 图片点击处理
const handleImageClick = (article: API.ArticlePageVO) => {
  if (article.cover) {
    openPreview(article.cover);
  } else {
    goToArticleDetail(article.id);
  }
};

// 恢复原有的 goToArticleDetail 函数
const goToArticleDetail = (id?: number) => {
  if (id) {
    saveCurrentPageState();
    router.push(`/article/${id}`);
  }
};

// 图片预览功能保持不变
const openPreview = (imageUrl?: string) => {
  if (!imageUrl) return;
  previewImageUrl.value = imageUrl;
  previewVisible.value = true;
};

// 暴露工具方法给模板
const { formatDate, getReadTime } = utils;
</script>


<style scoped>
/* 基础容器样式 */
.blogs-container {
  @apply space-y-8;
  container-type: inline-size;
}

.blogs-wrapper {
  @apply rounded-2xl shadow-md p-8;
  @apply transform transition-all duration-300;
  @apply hover:scale-[1.01] hover:shadow-xl;
  background: linear-gradient(to bottom right, white, #f0f9ff);
  
  /* 暗色模式容器背景 - 修正CSS选择器语法 */
  .dark & {
    background: linear-gradient(to bottom right, #1f2937, #111827);
  }
}

/* 标题样式 */
.blogs-title {
  @apply text-3xl font-bold mb-6 flex items-center;
}

.blogs-title-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #2563eb, #7c3aed);
  
  &.dark {
    background-image: linear-gradient(to right, #60a5fa, #a78bfa);
  }
}

.blogs-title-divider {
  @apply flex-grow ml-4 h-1 relative overflow-hidden;
  
  &::before {
    content: '';
    @apply absolute inset-0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #3b82f6 10%, 
      #8b5cf6 30%, 
      transparent 50%, 
      #ec4899 70%, 
      #f59e0b 90%, 
      transparent 100%);
    animation: particle-flow 4s linear infinite;
  }
  
  &::after {
    content: '';
    @apply absolute inset-0 opacity-70;
    background: radial-gradient(circle at center, 
      white 0%, 
      transparent 70%);
    animation: sparkle 2s ease-in-out infinite;
  }
}

@keyframes particle-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

/* 文章网格布局 */
.blogs-grid {
  @apply grid gap-6;
}

/* 文章卡片样式 - 注意移除了 @apply group */
.blog-article {
  @apply relative max-h-80;
  @apply rounded-xl overflow-hidden;
  @apply shadow-sm hover:shadow-md;
  @apply transition-all duration-300;
  @apply cursor-pointer;
  background-color: white;
  border: 1px solid #f3f4f6;
  
  &:hover {
    border-color: #bfdbfe;
  }

  /* 暗色模式样式 - 使用嵌套选择器确保正确应用样式 */
  .dark & {
    background-color: #1f2937;
    border-color: #374151; /* 暗色模式边框颜色 */
    
    &:hover {
      border-color: #1d4ed8;
    }
  }
}

/* 需要在模板中保留 group 类名 */
.article-container {
  @apply flex relative h-full;
  @apply flex-col md:flex-row;
}

.article-content {
  @apply p-6 relative overflow-hidden;
  @apply cursor-pointer;
  @apply bg-white;
  width: 50%;
  
  /* 暗色模式内容区背景 */
  .dark & {
    @apply bg-gray-800;
  }
}

.article-title {
  @apply font-semibold text-lg mb-2;
  @apply line-clamp-2;
  @apply transition-colors;
  color: inherit;
  
  .blog-article:hover & {
    color: #2563eb;
  }
  
  .dark .blog-article:hover & {
    color: #60a5fa;
  }
}

/* 其余样式保持不变... */
.article-summary {
  @apply text-sm mb-4;
  @apply line-clamp-3;
  color: #4b5563;
  
  /* 暗色模式文字颜色 */
  .dark & {
    color: #d1d5db;
  }
}

.article-meta {
  @apply flex items-center text-sm space-x-4;
  color: #6b7280;
  
  /* 暗色模式元信息颜色 */
  .dark & {
    color: #9ca3af;
  }
}

.meta-item {
  @apply flex items-center;
}

.meta-icon {
  @apply h-4 w-4 mr-1;
}

.article-category {
  @apply px-2 py-1 rounded-full text-xs font-medium;
  background-color: #dbeafe;
  color: #1e40af;
  
  /* 暗色模式分类标签 */
  .dark & {
    background-color: #1e3a8a;
    color: #93c5fd;
  }
}

.article-divider {
  @apply hidden md:block absolute top-0 bottom-0 left-1/2 w-12 z-20;
  transform: translateX(-50%);
  
  & > div {
    @apply absolute top-0 bottom-0 w-full shadow-md;
    background-color: white;
    transform: rotate(6deg);
    transform-origin: top left;
    
    /* 暗色模式分隔线 */
    .dark & {
      background-color: #1f2937;
    }
  }
}

.article-image-container {
  @apply h-48 md:h-full overflow-hidden;
  @apply cursor-pointer;
  width: 50%;
}

.article-image-wrapper {
  @apply h-full w-full;
  background-color: #f9fafb;
  
  /* 暗色模式图片容器背景 */
  .dark & {
    background-color: #111827;
  }
}

.article-image {
  @apply w-full h-full object-cover;
  @apply transform transition-transform duration-300;
  
  .blog-article:hover & {
    transform: scale(1.05);
  }
}

.article-image-placeholder {
  @apply h-full w-full flex items-center justify-center;
  background: linear-gradient(to bottom right, #dbeafe, #ddd6fe);
  
  /* 暗色模式占位图渐变 */
  .dark & {
    background: linear-gradient(to bottom right, #1e3a8a, #5b21b6);
  }
}

.placeholder-icon {
  @apply h-16 w-16;
  color: #2563eb;
  
  /* 暗色模式图标颜色 */
  .dark & {
    color: #60a5fa;
  }
}

.pagination-container {
  @apply flex items-center justify-center mt-8 space-x-4;
}

.pagination-button {
  @apply px-4 py-2 text-white rounded-lg;
  @apply flex items-center space-x-2;
  @apply transition-all duration-300 shadow-sm hover:shadow;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  
  &:hover {
    background: linear-gradient(to right, #2563eb, #1d4ed8);
  }
  
  &:disabled {
    background: linear-gradient(to right, #d1d5db, #9ca3af);
    @apply cursor-not-allowed;
    
    /* 暗色模式禁用按钮 */
    .dark & {
      background: linear-gradient(to right, #4b5563, #374151);
    }
  }
}

.pagination-icon {
  @apply h-4 w-4;
}

.pagination-info {
  @apply font-medium;
  color: #4b5563;
  
  /* 暗色模式分页信息 */
  .dark & {
    color: #d1d5db;
  }
}

@container (max-width: 768px) {
  .article-container {
    flex-direction: column;
  }
  
  .article-content, .article-image-container {
    width: 100%;
  }
}

/* 性能优化 - 保留 will-change */
.blog-article {
  will-change: transform, box-shadow;
}
</style>