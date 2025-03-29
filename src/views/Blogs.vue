<template>
  <div class="blogs-container">
    <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md p-8 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
      <h1 class="text-3xl font-bold mb-6 flex items-center">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Blog Posts</span>
        <div class="flex-grow border-b-2 border-gray-200 ml-4"></div>
      </h1>
      
      <!-- 文章列表 -->
      <div class="grid gap-6">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer"
          @click="goToArticleDetail(article.id)"
        >
          <div class="flex items-start space-x-6">
            <div class="w-64 h-48 rounded-lg overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-300 cursor-zoom-in" :class="{'bg-gradient-to-br from-blue-100 to-purple-100': !article.cover}" @click.stop="openPreview(article.cover)">
              <img v-if="article.cover" :src="article.cover" class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" :alt="article.title" loading="lazy" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="flex-grow">
              <h2 class="font-semibold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                {{ article.title }}
              </h2>
              <p class="text-gray-600 text-sm mb-4">
                {{ article.summary || '暂无摘要' }}
              </p>
              <div class="flex items-center text-sm text-gray-500 space-x-4">
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(article.createTime) }}
                </span>
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ getReadTime(article.wordCount) }} min read
                </span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {{ article.categoryName }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
      
      <!-- 分页控件 -->
      <div class="flex items-center justify-center mt-8 space-x-4" v-if="total > 0">
        <button 
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-2" 
          :disabled="current === 1"
          @click="changePage(current - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>上一页</span>
        </button>
        <span class="text-gray-600 font-medium">{{ current }} / {{ totalPages }}</span>
        <button 
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow flex items-center space-x-2" 
          :disabled="current === totalPages"
          @click="changePage(current + 1)"
        >
          <span>下一页</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- 回到顶部按钮 -->
  <BackToTop :visibility-height="300" :duration="500" />
  
  <!-- 图片预览组件 -->
  <ImageViewer
    v-model:visible="previewVisible"
    :image-url="previewImageUrl"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import ImageViewer from '../components/ImageViewer.vue';
import BackToTop from '../components/BackToTop.vue';
import { useRouter, useRoute } from 'vue-router';
import { getArticlePageList } from '../api/generated/api/articleController';
import { savePageState } from '@/utils/pageMemory';

const router = useRouter();
const route = useRoute();
const articles = ref<API.ArticlePageVO[]>([]);
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const loading = ref(false);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

// 从URL参数中获取初始分页状态
onMounted(() => {
  // 检查URL中是否有页码参数
  const pageParam = route.query.page;
  const pageSizeParam = route.query.pageSize;
  
  if (pageParam && typeof pageParam === 'string') {
    const pageNumber = parseInt(pageParam);
    if (!isNaN(pageNumber) && pageNumber > 0) {
      current.value = pageNumber;
    }
  }
  
  if (pageSizeParam && typeof pageSizeParam === 'string') {
    const pageSizeNumber = parseInt(pageSizeParam);
    if (!isNaN(pageSizeNumber) && pageSizeNumber > 0) {
      pageSize.value = pageSizeNumber;
    }
  }
  
  loadArticles();
});

// 监听分页变化，更新URL参数
watch([current, pageSize], () => {
  // 获取当前的categoryId参数（如果有）
  const categoryId = route.query.categoryId;
  
  // 更新URL，不触发路由变化
  const query: Record<string, string> = {
    page: current.value.toString(),
    pageSize: pageSize.value.toString()
  };
  
  // 如果有分类ID，保留在URL中
  if (categoryId) {
    query.categoryId = categoryId as string;
  }
  
  router.replace({
    path: '/blogs',
    query
  });
  
  // 保存当前分页状态和滚动位置
  saveCurrentPageState();
});

// 监听路由参数变化，当categoryId变化时重新加载文章
watch(
  () => route.query.categoryId,
  () => {
    // 分类变化时，重置为第一页
    current.value = 1;
    loadArticles();
    // 回到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
);

// 保存当前分页状态
const saveCurrentPageState = () => {
  savePageState(
    current.value,
    pageSize.value,
    window.scrollY
  );
};

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
    
    // 如果URL中有categoryId参数，添加到查询条件
    const categoryId = route.query.categoryId;
    if (categoryId && typeof categoryId === 'string') {
      params.categoryIds = [parseInt(categoryId)];
    }
    
    const res = await getArticlePageList(params);
    console.log('API响应数据:', res);
    
    // 根据实际返回数据结构进行处理
    if (res.data && res.data.data) {
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
  current.value = page;
  loadArticles();
  
  // 回到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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
    // 保存当前分页状态再跳转
    saveCurrentPageState();
    router.push(`/article/${id}`);
  }
};

// 图片预览功能
const previewVisible = ref(false);
const previewImageUrl = ref('');

const openPreview = (imageUrl?: string) => {
  if (!imageUrl) return;
  previewImageUrl.value = imageUrl;
  previewVisible.value = true;
};
</script>

<style scoped>
.blogs-container {
  @apply space-y-8;
}
</style>