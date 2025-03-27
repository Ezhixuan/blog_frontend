<template>
  <div class="blogs-container">
    <div class="blogs-card">
      <h1 class="blogs-title">Blog Posts</h1>
      
      <!-- 文章列表 -->
      <div class="blogs-grid">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="blog-item"
          @click="goToArticleDetail(article.id)"
        >
          <h2 class="blog-heading">
            <a href="javascript:void(0)">{{ article.title }}</a>
          </h2>
          <p class="blog-summary">
            {{ article.summary || '暂无摘要' }}
          </p>
          <div class="blog-meta">
            <span>{{ formatDate(article.createTime) }}</span>
            <span class="meta-separator">•</span>
            <span>{{ getReadTime(article.wordCount) }} min read</span>
            <span class="meta-separator">•</span>
            <a href="javascript:void(0)" class="meta-tag">{{ article.categoryName }}</a>
          </div>
        </article>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination" v-if="total > 0">
        <button 
          class="pagination-btn" 
          :disabled="current === 1"
          @click="changePage(current - 1)"
        >
          上一页
        </button>
        <span class="pagination-info">{{ current }} / {{ totalPages }}</span>
        <button 
          class="pagination-btn" 
          :disabled="current === totalPages"
          @click="changePage(current + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getArticlePageList } from '../api/generated/api/articleController';

const router = useRouter();
const articles = ref<API.ArticlePageVO[]>([]);
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const loading = ref(false);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

// 加载文章列表
const loadArticles = async () => {
  loading.value = true;
  try {
    const params: API.ArticleQueryDTO = {
      current: current.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend'
    };
    
    const res = await getArticlePageList(params);
    console.log('API响应数据:', res);
    
    // 根据实际返回数据结构进行处理
    if (res.data) {
      articles.value = res.data || [];
      total.value = Number(res.total) || 0;
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
  current.value = page;
  loadArticles();
};

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('zh-CN', options);
};

// 计算阅读时间
const getReadTime = (wordCount?: number) => {
  if (!wordCount) return 1;
  // 假设阅读速度为每分钟200字
  return Math.max(1, Math.ceil(wordCount / 200));
};

// 跳转到文章详情页
const goToArticleDetail = (id?: number) => {
  if (id) {
    router.push(`/article/${id}`);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.blogs-container {
  @apply space-y-8;
}

.blogs-card {
  @apply bg-white rounded-2xl shadow-sm p-8;
}

.blogs-title {
  @apply text-3xl font-bold mb-6;
}

.blogs-grid {
  @apply grid gap-8;
}

.blog-item {
  @apply border-b pb-8 last:border-0 last:pb-0 cursor-pointer transition-transform duration-300 hover:scale-[1.02];
}

.blog-heading {
  @apply text-2xl font-semibold mb-4 text-gray-800 hover:text-blue-600 transition-colors;
}

.blog-summary {
  @apply text-gray-600 mb-4;
}

.blog-meta {
  @apply flex items-center text-sm text-gray-500;
}

.meta-separator {
  @apply mx-2;
}

.meta-tag {
  @apply text-blue-600 hover:text-blue-800;
}

.pagination {
  @apply flex items-center justify-center mt-8 space-x-4;
}

.pagination-btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition;
}

.pagination-info {
  @apply text-gray-600;
}
</style>