<template>
  <div class="blogs-container">
    <div class="blogs-wrapper">
      <StarfieldBackground />
      <!-- 现代化标题设计 -->
      <div class="blogs-header">
        <h1 class="blogs-title">
          <span class="blogs-title-text">博客文章</span>
        </h1>
        <div class="blogs-title-divider"></div>
        <p class="blogs-subtitle">分享技术见解与思考</p>
      </div>

      <!-- 文章列表 -->
      <div class="blogs-grid">
        <article 
          v-for="article in articles" 
          :key="article.id"
          class="blog-article group"
          role="article" 
          :aria-labelledby="`article-title-${article.id}`"
        >
          <!-- 装饰性发光效果 -->
          <div class="article-glow"></div>
          
          <div class="article-container">
            <!-- 左侧内容 - 点击查看文章 -->
            <div 
              class="article-content group"
              @click="goToArticleDetail(article.id)"
            >
              <div class="article-title-container">
                <h2 
                  :id="`article-title-${article.id}`"
                  class="article-title"
                >
                  {{ article.title }}
                </h2>
                <div class="article-status-container">
                  <span 
                    v-if="article.status === 0" 
                    class="article-status article-status-draft"
                  >
                    <svg class="status-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clip-rule="evenodd" />
                    </svg>
                    草稿
                  </span>
                  <span 
                    v-else-if="article.status === 1" 
                    class="article-status article-status-published"
                  >
                    <svg class="status-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    已发布
                  </span>
                </div>
              </div>
              
              <p class="article-summary">
                {{ article.summary || '暂无摘要' }}
              </p>
              
              <div class="article-meta">
                <span class="meta-item">
                  <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(article.createTime) }}
                </span>
                <span class="meta-item">
                  <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ getReadTime(article.wordCount) }} 分钟阅读
                </span>
                <span class="article-category">
                  <svg class="category-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ article.categoryName }}
                </span>
              </div>
            </div>
            
            <!-- 右侧图片 -->
            <div 
              class="article-image-container"
              @click.stop="handleImageClick(article)"
            >
              <div v-if="article.cover" class="article-image-wrapper group/image">
                <img 
                  :src="article.cover"
                  class="article-image"
                  :alt="article.title" 
                  loading="lazy" 
                  decoding="async" 
                />
                <div class="image-overlay">
                  <svg class="overlay-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div v-else class="article-image-placeholder">
                <div class="placeholder-content">
                  <svg class="placeholder-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="placeholder-text">暂无配图</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-container" v-if="total > 0">
        <button
          class="pagination-button pagination-button-prev"
          :class="{ 'pagination-button-disabled': pagination.current === 1 }"
          :disabled="pagination.current === 1" 
          @click="changePage(pagination.current - 1)" 
          aria-label="上一页"
          :aria-disabled="pagination.current === 1"
        >
          <svg class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>上一页</span>
        </button>
        
        <div class="pagination-info">
          <span class="pagination-current">{{ pagination.current }}</span>
          <span class="pagination-separator">/</span>
          <span class="pagination-total">{{ pagination.totalPages }}</span>
        </div>
        
        <button
          class="pagination-button pagination-button-next"
          :class="{ 'pagination-button-disabled': pagination.current === pagination.totalPages }"
          :disabled="pagination.current === pagination.totalPages" 
          @click="changePage(pagination.current + 1)"
          aria-label="下一页" 
          :aria-disabled="pagination.current === pagination.totalPages"
        >
          <span>下一页</span>
          <svg class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { ref, computed, onMounted, watch } from 'vue';
import ImageViewer from '@/components/ui/ImageViewer/index.vue';
import BackToTop from '@/components/layout/BackToTop/BackToTop.vue';
import { useRouter, useRoute } from 'vue-router';
import { getArticleList as getArticlePageList } from '@/api/modules/blog';
import { savePageState } from '@/utils/helpers/pageMemory';
import StarfieldBackground from '@/components/layout/StarfieldBackground.vue';

interface ArticleQueryParams {
  current: number;
  pageSize: number;
  page: number;
  sortOrder: string; // 修复类型错误：明确指定为 string 类型
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
  [() => route.query.categoryId, () => route.query.tagId],
  (newParams, oldParams) => {
    if (route.path !== '/blogs') return;
    
    // 检查分类或标签是否真的变化了
    const [newCategoryId, newTagId] = newParams;
    const [oldCategoryId, oldTagId] = oldParams || [];
    
    if (newCategoryId !== oldCategoryId || newTagId !== oldTagId) {
      // 只有分类或标签变化时，才重置页码到第一页
      current.value = 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    loadArticles();
  },
  { flush: 'sync' }
);

// 监听页码变化，更新URL
watch(
  [() => current.value, () => pageSize.value],
  ([newCurrent, newPageSize]) => {
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
      page: current.value,
      sortOrder: 'desc' // 修复：明确赋值为字符串
    };

    const { categoryId, tagId } = utils.getQueryParams(route);
    if (categoryId) params.categoryIds = [parseInt(categoryId)];
    if (tagId) params.tagIds = [parseInt(tagId)];

    const res = await getArticlePageList(params);

    if (res.data) {
      articles.value = res.data.data || [];
      total.value = res.data.total || 0;
    } else {
      console.error('获取文章列表失败:', res.message);
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
  loadArticles();
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
/* 容器样式 - 按照设计系统规范 */
.blogs-container {
  @apply mb-12;
  container-type: inline-size;
}

.blogs-wrapper {
  @apply bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md hover:shadow-2xl;
  @apply transition-all duration-500 border border-gray-100 dark:border-gray-700;
  background: linear-gradient(to bottom right, 
    rgba(253, 253, 253, 0.9), 
    rgba(134, 181, 204, 0.9)
  );
  
  .dark & {
    background: linear-gradient(to bottom right, 
      rgba(31, 41, 55, 0.9), 
      rgba(17, 24, 39, 0.9)
    );
  }
}

/* 标题区域 - 现代化设计 */
.blogs-header {
  @apply mb-12 text-center;
}

.blogs-title {
  @apply text-4xl md:text-5xl font-bold mb-4;
}

.blogs-title-text {
  @apply bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent;
  
  .dark & {
    @apply bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400;
  }
}

.blogs-title-divider {
  @apply w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4;
}

.blogs-subtitle {
  @apply text-lg text-gray-600 dark:text-gray-300;
}

/* 文章网格布局 */
.blogs-grid {
  @apply grid gap-8;
}

/* 文章卡片样式 - 按照设计系统规范 */
.blog-article {
  @apply relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl;
  @apply transition-all duration-500 border border-gray-100 dark:border-gray-700;
  @apply hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-2;
  @apply overflow-hidden cursor-pointer;
  will-change: transform, box-shadow;
}

/* 装饰性发光效果 */
.article-glow {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500;
  @apply rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl;
}

.article-container {
  @apply relative flex h-full;
  @apply flex-col md:flex-row;
  min-height: 280px;
  max-height: 320px;
}

/* 文章内容区域 */
.article-content {
  @apply p-8 relative overflow-hidden cursor-pointer;
  @apply bg-white dark:bg-gray-800;
  @apply transition-all duration-300;
  flex: 1 1 60%;
  max-width: 60%;
}

.article-title-container {
  @apply flex items-start justify-between mb-4 gap-4;
}

.article-title {
  @apply text-xl font-bold flex-1 line-clamp-2;
  @apply text-gray-900 dark:text-white;
  @apply group-hover:text-blue-600 dark:group-hover:text-blue-400;
  @apply transition-colors duration-300;
}

/* 状态标签 - 现代化设计 */
.article-status-container {
  @apply flex-shrink-0;
}

.article-status {
  @apply flex items-center px-3 py-1.5 text-xs font-medium rounded-full;
  @apply border transition-all duration-300;
}

.status-icon {
  @apply h-3 w-3 mr-1.5;
}

.article-status-draft {
  @apply bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400;
  @apply border-yellow-200 dark:border-yellow-700;
}

.article-status-published {
  @apply bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400;
  @apply border-green-200 dark:border-green-700;
}

.article-summary {
  @apply text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed;
}

/* 元信息 - 优化设计 */
.article-meta {
  @apply flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400;
  @apply flex-wrap;
}

.meta-item {
  @apply flex items-center gap-2 whitespace-nowrap;
}

.meta-icon {
  @apply h-4 w-4;
}

.article-category {
  @apply flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium;
  @apply bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400;
  @apply border border-blue-200 dark:border-blue-700;
  @apply whitespace-nowrap;
}

.category-icon {
  @apply h-3 w-3;
}

/* 图片容器 - 改进设计 */
.article-image-container {
  @apply relative overflow-hidden cursor-pointer;
  @apply transition-all duration-300;
  flex: 0 0 40%;
  max-width: 40%;
}

.article-image-wrapper {
  @apply h-full w-full relative;
}

.article-image {
  @apply w-full h-full object-cover transition-transform duration-500;
  @apply group-hover:scale-110;
}

.image-overlay {
  @apply absolute inset-0 bg-black/0 group-hover/image:bg-black/20;
  @apply flex items-center justify-center transition-all duration-300;
  @apply opacity-0 group-hover/image:opacity-100;
}

.overlay-icon {
  @apply h-8 w-8 text-white transform scale-75 group-hover/image:scale-100;
  @apply transition-transform duration-300;
}

.article-image-placeholder {
  @apply h-full w-full flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50;
  @apply dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20;
}

.placeholder-content {
  @apply text-center;
}

.placeholder-icon {
  @apply h-16 w-16 mx-auto mb-2 text-blue-400 dark:text-blue-500;
}

.placeholder-text {
  @apply text-sm text-gray-500 dark:text-gray-400 font-medium;
}

/* 分页组件 - 现代化设计 */
.pagination-container {
  @apply flex items-center justify-center mt-12 gap-6;
}

.pagination-button {
  @apply flex items-center gap-2 px-6 py-3 rounded-xl font-medium;
  @apply text-white transition-all duration-300 shadow-md hover:shadow-xl;
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply hover:from-blue-700 hover:to-purple-700;
  @apply transform hover:-translate-y-1;
}

.pagination-button-disabled {
  @apply bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700;
  @apply cursor-not-allowed opacity-60 hover:transform-none hover:shadow-md;
}

.pagination-icon {
  @apply h-4 w-4;
}

.pagination-info {
  @apply flex items-center gap-2 px-4 py-2 rounded-xl;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply font-medium;
}

.pagination-current {
  @apply text-blue-600 dark:text-blue-400 font-bold;
}

.pagination-separator {
  @apply text-gray-400 dark:text-gray-500;
}

.pagination-total {
  @apply text-gray-600 dark:text-gray-300;
}

/* 响应式设计 */
@container (max-width: 768px) {
  .article-container {
    flex-direction: column;
    min-height: auto;
    max-height: none;
  }
  
  .article-content {
    padding: 1.5rem;
    flex: none;
    max-width: none;
  }
  
  .article-image-container {
    flex: none;
    max-width: none;
    height: 180px;
    min-height: 180px;
    max-height: 180px;
  }
  
  .blogs-header {
    margin-bottom: 2rem;
  }
  
  .blogs-title {
    font-size: 2rem;
  }
  
  .article-meta {
    gap: 1rem;
  }
  
  .pagination-container {
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .pagination-button {
    padding: 0.75rem 1rem;
  }
}

/* 性能优化类 */
.blog-article {
  will-change: transform, box-shadow;
}
</style>