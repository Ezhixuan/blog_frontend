<template>
  <div class="article-container">
    <div class="article-card">
      <!-- 文章内容 -->
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
          <a href="javascript:void(0)" class="meta-tag">{{ article.categoryName }}</a>
        </div>
        
        <div class="article-content">
          <!-- 这里应该是文章的完整内容，后续可以改为使用Markdown渲染器 -->
          <p>{{ article.summary }}</p>
          <p>文章详情内容需要后端提供，目前仅展示摘要信息</p>
        </div>
        
        <div class="article-actions">
          <button class="action-btn like-btn">
            <span>点赞</span>
            <span>{{ article.likeCount || 0 }}</span>
          </button>
        </div>
      </div>
      
      <div v-else class="article-not-found">
        <h2>文章不存在或已被删除</h2>
        <button class="back-btn" @click="goBack">返回文章列表</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleInfo } from '../api/generated/api/articleController';

const route = useRoute();
const router = useRouter();
const articleId = ref<string | null>(null);
const article = ref<API.ArticleInfoVO | null>(null);
const loading = ref(true);

// 获取文章详情
const fetchArticleDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getArticleInfo({ id });
    console.log('文章详情响应:', res);
    
    // 根据实际返回数据结构进行处理
    if (res.data?.data) {
      article.value = res.data.data;
    } else {
      console.error('获取文章详情失败:', res.data?.message);
      article.value = null;
    }
  } catch (error) {
    console.error('获取文章详情失败', error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('zh-CN', options);
};

onMounted(() => {
  const id = route.params.id;
  if (id) {
    articleId.value = id;
    fetchArticleDetail(id);
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.article-container {
  @apply space-y-8;
}

.article-card {
  @apply bg-white rounded-2xl shadow-sm p-8;
}

.article-title {
  @apply text-3xl font-bold mb-4;
}

.article-meta {
  @apply flex items-center text-sm text-gray-500 mb-8;
}

.meta-separator {
  @apply mx-2;
}

.meta-tag {
  @apply text-blue-600 hover:text-blue-800;
}

.article-content {
  @apply text-gray-700 leading-relaxed mb-8;
}

.article-actions {
  @apply flex items-center justify-center border-t pt-6 mt-8;
}

.action-btn {
  @apply flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors;
}

.like-btn {
  @apply text-pink-600;
}

.loading-indicator {
  @apply flex flex-col items-center justify-center py-12;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4;
}

.article-not-found {
  @apply text-center py-12;
}

.back-btn {
  @apply mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
}
</style>