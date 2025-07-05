<template>
  <div class="article-page">
    <!-- 阅读进度条 -->
    <div class="reading-progress">
      <div class="progress-bar" :style="{ width: readingProgress + '%' }"></div>
    </div>

    <!-- 顶部导航栏 -->
    <header class="article-header" :class="{
      'header-scrolled': isHeaderScrolled
    }">
      <div class="header-container" :class="{
        'container-compact': isHeaderScrolled
      }">
        <button class="back-btn group" @click="handleBackToList" aria-label="返回文章列表">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7-7l-7 7 7 7"/>
          </svg>
          <span class="back-text">返回</span>
        </button>
        
        <!-- 文章标题 - 滚动时显示 -->
        <div class="header-title" :class="{
          'title-visible': isHeaderScrolled && article?.title
        }">
          <h1 v-if="article?.title">{{ article.title }}</h1>
        </div>
        
        <!-- 阅读进度指示器 -->
        <div class="header-progress" :class="{
          'progress-visible': isHeaderScrolled
        }">
          <div class="progress-circle">
            <svg class="progress-ring" viewBox="0 0 36 36">
              <path class="progress-ring-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
              <path class="progress-ring-fill"
                :style="{ strokeDasharray: `${readingProgress}, 100` }"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            </svg>
            <span class="progress-text">{{ Math.round(readingProgress) }}%</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="article-main">
      <div class="main-container">
        <!-- 文章内容区 -->
        <article class="article-content-wrapper">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载文章...</p>
          </div>

          <!-- 文章内容 -->
          <div v-else-if="article" class="article-content">
            <!-- 文章头部 -->
            <header class="article-content-header">
              <h1 class="article-title">{{ article.title }}</h1>
              
              <!-- 文章元信息 -->
              <div class="article-meta">
                <div class="meta-row primary">
                  <time class="meta-item meta-date" :datetime="article.createTime">
                    <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ formatDate(article.createTime) }}</span>
                  </time>
                  <div class="meta-divider"></div>
                  <div class="meta-item meta-words">
                    <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ article.wordCount || 0 }} 字</span>
                  </div>
                  <div class="meta-divider"></div>
                  <div class="meta-item meta-views">
                    <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ article.viewCount || 0 }} 次阅读</span>
                  </div>
                </div>
                
                <div class="meta-row secondary">
                  <div class="meta-category-tags">
                    <span class="meta-category">
                      <svg class="category-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                      {{ article.categoryName }}
                    </span>
                    
                    <!-- 标签 -->
                    <div v-if="article.tagMap && Object.keys(article.tagMap).length > 0" class="article-tags-inline">
                      <span v-for="(value, key) in article.tagMap" :key="key" class="tag group">
                        <svg class="tag-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                        </svg>
                        {{ value }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="article-actions">
                    <button 
                      v-if="isAuthor" 
                      @click="handleEditArticle" 
                      class="edit-btn"
                    >
                      <svg class="edit-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span>编辑</span>
                    </button>
                    <button 
                      v-if="isAdmin" 
                      @click="handleDeleteArticle" 
                      class="delete-btn"
                    >
                      <svg class="delete-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                      </svg>
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <!-- 文章摘要 -->
            <div v-if="article.summary" class="article-summary">
              <div class="summary-content">
                <div class="summary-icon-wrapper">
                  <svg class="summary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="summary-text">
                  <h3 class="summary-title">文章摘要</h3>
                  <p>{{ article.summary }}</p>
                </div>
              </div>
            </div>

            <!-- 文章正文 -->
            <div class="article-body">
              <MarkdownPreview 
                v-if="article.content" 
                :content="article.content" 
                @content-updated="handleContentUpdated"
                ref="markdownPreviewRef" 
              />
              <div v-else class="no-content">
                <svg class="no-content-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>暂无文章内容</p>
              </div>
            </div>

            <!-- 文章底部操作区 -->
            <footer class="article-footer">
              <div class="actions">
                <button class="action-btn like-btn" @click="handleThumb">
                  <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span class="action-text">点赞</span>
                  <span class="action-count">{{ article.likeCount || 0 }}</span>
                </button>

                <button v-if="isAuthor" @click="handleEditArticle" class="action-btn edit-action-btn">
                  <svg class="action-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span class="action-text">编辑文章</span>
                </button>

                <button v-if="isAdmin" @click="handleDeleteArticle" class="action-btn delete-action-btn">
                  <svg class="action-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                  </svg>
                  <span class="action-text">删除文章</span>
                </button>
              </div>
            </footer>
          </div>

          <!-- 文章不存在 -->
          <div v-else class="not-found">
            <div class="not-found-content">
              <div class="not-found-icon-wrapper">
                <svg class="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h2>文章不存在</h2>
              <p>抱歉，您访问的文章不存在或已被删除</p>
              <button class="back-to-list-btn" @click="goBack">
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                返回文章列表
              </button>
            </div>
          </div>
        </article>

        <!-- 右侧目录已移动到左侧导航栏 -->
      </div>
    </main>

    <!-- 移动端目录现在也在左侧导航栏中 -->

    <!-- 回到顶部 -->
    <BackToTop :visibility-height="300" :duration="500" />

    <!-- 图片预览 -->
    <ImageViewer v-model:visible="previewVisible" :image-url="previewImageUrl" />

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
      <div class="delete-confirm-modal">
        <div class="delete-confirm-header">
          <svg class="delete-confirm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3>确认删除文章</h3>
        </div>
        <div class="delete-confirm-content">
          <p>您确定要删除文章 <strong>"{{ article?.title }}"</strong> 吗？</p>
          <p class="delete-warning">此操作不可逆，删除后无法恢复。</p>
        </div>
        <div class="delete-confirm-actions">
          <button 
            @click="cancelDeleteArticle" 
            class="cancel-btn"
            :disabled="deleting"
          >
            取消
          </button>
          <button 
            @click="confirmDeleteArticle" 
            class="confirm-delete-btn"
            :disabled="deleting"
          >
            <svg v-if="deleting" class="loading-spinner" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed, provide, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleById as getArticleInfo, thumbArticle as doThumb } from '@/api/modules/blog';
import { deleteArticle } from '@/api/modules/blog';
import BackToTop from '@/components/layout/BackToTop/BackToTop.vue';
import ImageViewer from '@/components/ui/ImageViewer/index.vue';
import 'md-editor-v3/lib/style.css';
import { useUserStore } from '@/stores/user';
import { getPageState } from '@/utils/helpers/pageMemory';
import 'md-editor-v3/lib/preview.css';
import MarkdownPreview from '@/components/business/Blog/MarkdownPreview.vue';
import messageService from '@/utils/helpers/message';
import { emit } from '@/utils/helpers/eventBus';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const articleId = ref<string | null>(null);
const article = ref<any>(null);
const loading = ref(true);
const readingProgress = ref(0);
const markdownPreviewRef = ref<any>(null);
const renderedContent = ref('');
const previewVisible = ref(false);
const previewImageUrl = ref('');
const isMobile = ref(false);

// 动态导航栏状态
const isHeaderScrolled = ref(false);
const lastScrollY = ref(0);

// 删除相关状态
const showDeleteConfirm = ref(false);
const deleting = ref(false);

// 计算属性
const isAuthor = computed(() => userStore.userInfo?.id === article.value?.userId);
const isAdmin = computed(() => userStore.userInfo?.role === 'admin');

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// 工具函数
const goBack = () => router.back();
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 业务逻辑函数
const handleThumb = async () => {
  if (!article.value || !articleId.value) return;
  try {
    const operateById = { id: articleId.value };
    const res = await doThumb(operateById);
    if (res.code === 0) {
      article.value.likeCount = res.data ? article.value.likeCount + 1 : article.value.likeCount - 1;
    } else {
      messageService.error('点赞失败');
    }
  } catch (error) {
    messageService.error('点赞失败');
  }
};

const handleEditArticle = () => {
  if (!article.value) return;
  router.push({
    path: '/blog/edit',
    query: { id: articleId.value }
  });
};

const handleDeleteArticle = () => {
  showDeleteConfirm.value = true;
};

const confirmDeleteArticle = async () => {
  if (!article.value || !articleId.value) return;
  
  try {
    deleting.value = true;
    const res = await deleteArticle(parseInt(articleId.value));
    
    if (res.code === 0) {
      messageService.success('文章删除成功');
      // 删除成功后返回文章列表
      router.push('/blogs');
    } else {
      messageService.error(res.message || '删除失败');
    }
  } catch (error) {
    console.error('删除文章失败:', error);
    messageService.error('删除失败，请稍后再试');
  } finally {
    deleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const cancelDeleteArticle = () => {
  showDeleteConfirm.value = false;
};

const handleContentUpdated = (content: string) => {
  console.log('🔄 文章内容已渲染完成');
  renderedContent.value = content;
  // 内容更新后，通过EventBus通知Sidebar更新目录
};

const fetchArticleDetail = async (id: string) => {
  try {
    loading.value = true;
    const res = await getArticleInfo(id);
    article.value = res.data || null;
    
    // 文章加载完成后，等待DOM更新再滚动到顶部
    if (article.value) {
      await nextTick();
      setTimeout(() => {
        scrollToTop();
        console.log('📖 文章内容加载完成，滚动到顶部');
      }, 150); // 给内容渲染一些时间
    }
  } catch (error) {
    article.value = null;
    console.error('文章加载失败:', error);
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

// 动态导航栏逻辑
const handleHeaderScroll = () => {
  const scrollY = window.scrollY;
  const scrollThreshold = 100; // 滚动多少像素后开始改变状态
  
  // 🔧 添加调试日志
  console.log('🏝️ 灵动岛滚动检测:', {
    scrollY,
    scrollThreshold,
    isHeaderScrolled: isHeaderScrolled.value,
    lastScrollY: lastScrollY.value
  });
  
  // 更新是否已滚动状态
  const shouldBeScrolled = scrollY > scrollThreshold;
  if (isHeaderScrolled.value !== shouldBeScrolled) {
    isHeaderScrolled.value = shouldBeScrolled;
    console.log('🏝️ 灵动岛状态变化:', {
      state: shouldBeScrolled ? '灵动岛模式' : '正常模式',
      scrollY,
      threshold: scrollThreshold
    });
    
    // 🔧 实时CSS调试
    setTimeout(() => {
      const header = document.querySelector('.article-header');
      if (header) {
        const classList = Array.from(header.classList);
        const styles = getComputedStyle(header);
        console.log('🎨 实时CSS状态:', {
          hasHeaderScrolledClass: classList.includes('header-scrolled'),
          classList: classList,
          position: styles.position,
          top: styles.top,
          zIndex: styles.zIndex,
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          backdropFilter: styles.backdropFilter,
          minHeight: styles.minHeight,
          transform: styles.transform,
          visibility: styles.visibility,
          display: styles.display
        });
      }
    }, 50); // 等待DOM更新
  }
  
  lastScrollY.value = scrollY;
};

// 移动端目录相关方法已移除，目录现在在左侧导航栏中

const handleBackToList = () => {
  const pageState = getPageState();
  if (pageState) {
    const query: Record<string, string> = {
      page: pageState.current.toString(),
      pageSize: pageState.pageSize.toString()
    };

    if (pageState.categoryId && typeof pageState.categoryId === 'string') {
      query.categoryId = pageState.categoryId;
    }
    if (pageState.tagId && typeof pageState.tagId === 'string') {
      query.tagId = pageState.tagId;
    }

    router.push({ path: '/blogs', query });
    console.log('🔙 返回文章列表，恢复之前的滚动位置');
    if (pageState.scrollPosition && typeof pageState.scrollPosition === 'number') {
      setTimeout(() => {
        window.scrollTo({
          top: pageState.scrollPosition as number,
          behavior: 'smooth'
        });
      }, 100);
    }
  } else {
    console.log('🔙 返回文章列表，滚动到顶部');
    router.push('/blogs');
    // 如果没有保存的状态，返回到顶部
    setTimeout(() => {
      scrollToTop();
    }, 100);
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

// 节流函数
const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  } as T;
};

const handleScroll = throttle(() => {
  console.log('📜 handleScroll被调用, scrollY:', window.scrollY);
  calculateReadingProgress();
  handleHeaderScroll();
}, 100);

// 提供阅读进度给Toc组件
provide('readingProgress', readingProgress);

// 使用EventBus发送文章内容给Sidebar组件显示目录
const emitArticleContent = () => {
  const content = renderedContent.value;
  console.log('📡 ArticleDetail通过EventBus发送文章内容到Sidebar');
  
  // 通过EventBus发送内容
  emit('article-content-updated', {
    content,
    path: route.path
  });
};

// 监听内容变化并发送
watch(() => renderedContent.value, (newContent: string) => {
  if (newContent) {
    emitArticleContent();
  }
}, { immediate: true });

// 保留provide用于Toc组件
provide('articleContent', computed(() => renderedContent.value));

// 自动滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  // 重置导航栏状态
  isHeaderScrolled.value = false;
  lastScrollY.value = 0;
  
  console.log('📜 自动滚动到页面顶部');
};

// 监听路由参数变化，处理文章切换
watch(() => route.params.id, (newId, oldId) => {
  if (newId && typeof newId === 'string' && newId !== oldId) {
    console.log('🔄 文章ID变化，加载新文章:', newId);
    articleId.value = newId;
    
    // 立即滚动到顶部，然后加载新文章（fetchArticleDetail会在加载完成后再次滚动确保位置正确）
    scrollToTop();
    fetchArticleDetail(newId);
  }
}, { immediate: false });

// 生命周期
onMounted(() => {
  console.log('🚀 ArticleDetail组件挂载开始');
  
  const id = route.params.id;
  if (id && typeof id === 'string') {
    articleId.value = id;
    // fetchArticleDetail会处理滚动到顶部
    fetchArticleDetail(id);
  }

  // 初始化移动端检测
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // 🔧 灵动岛初始化调试
  console.log('🏝️ 灵动岛初始化:', {
    initialScrollY: window.scrollY,
    isHeaderScrolled: isHeaderScrolled.value,
    isMobile: isMobile.value
  });
  
  // 初始化导航栏状态
  isHeaderScrolled.value = false;
  lastScrollY.value = window.scrollY || 0;
  
  document.addEventListener('click', handleImageClick);
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  console.log('🔧 滚动事件监听器已添加');
  
  // 🔧 移动端白边调试 - 新增
  if (window.innerWidth <= 768) {
    console.log('📱 移动端白边调试开始');
    
    // 检查视口设置
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    console.log('📱 视口设置:', viewport ? viewport.content : '未找到viewport meta');
    
    // 检查body和html的宽度
    const bodyRect = document.body.getBoundingClientRect();
    const htmlRect = document.documentElement.getBoundingClientRect();
    console.log('📱 Body尺寸:', {
      width: bodyRect.width,
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth
    });
    console.log('📱 HTML尺寸:', {
      width: htmlRect.width,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    });
    
    // 检查主要容器的宽度
    setTimeout(() => {
      const containers = [
        '.article-page',
        '.article-main', 
        '.main-container',
        '.article-content-wrapper',
        '.article-content'
      ];
      
      containers.forEach(selector => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          const rect = element.getBoundingClientRect();
          const styles = getComputedStyle(element);
          console.log(`📱 ${selector} 尺寸:`, {
            width: rect.width,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
            offsetWidth: element.offsetWidth,
            computedWidth: styles.width,
            computedMaxWidth: styles.maxWidth,
            padding: `${styles.paddingLeft} ${styles.paddingRight}`,
            margin: `${styles.marginLeft} ${styles.marginRight}`,
            boxSizing: styles.boxSizing,
            overflowX: styles.overflowX
          });
        }
      });
      
      // 检查所有可能溢出的元素
      const potentialOverflowElements = document.querySelectorAll('pre, table, img, .tag, .meta-item');
      potentialOverflowElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          console.log(`🚨 发现溢出元素 ${index}:`, {
            tagName: element.tagName,
            className: element.className,
            width: rect.width,
            viewportWidth: window.innerWidth,
            overflowAmount: rect.width - window.innerWidth,
            element: element
          });
        }
      });
      
    }, 1000);
  }
  
  // 🔧 添加CSS调试
  setTimeout(() => {
    const header = document.querySelector('.article-header');
    if (header) {
      const styles = getComputedStyle(header);
      console.log('🎨 灵动岛CSS调试:', {
        position: styles.position,
        top: styles.top,
        zIndex: styles.zIndex,
        display: styles.display,
        visibility: styles.visibility,
        transform: styles.transform,
        borderRadius: styles.borderRadius
      });
    } else {
      console.error('❌ 找不到.article-header元素');
    }
  }, 1000);
  
  // 🔧 添加强制CSS检查函数
  (window as any).checkDynamicIslandCSS = () => {
    const header = document.querySelector('.article-header');
    if (header) {
      const classList = Array.from(header.classList);
      const styles = getComputedStyle(header);
      console.log('💎 强制CSS检查:', {
        currentScrollY: window.scrollY,
        hasHeaderScrolledClass: classList.includes('header-scrolled'),
        classList: classList,
        position: styles.position,
        top: styles.top,
        zIndex: styles.zIndex,
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        backdropFilter: styles.backdropFilter,
        minHeight: styles.minHeight,
        elementRect: header.getBoundingClientRect()
      });
    } else {
      console.error('❌ 找不到.article-header元素');
    }
  };
  
  // 🔧 添加移动端白边检查函数
  (window as any).checkMobileWhiteBorder = () => {
    if (window.innerWidth <= 768) {
      console.log('🔍 手动检查移动端白边问题');
      
      const bodyScrollWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      const overflow = bodyScrollWidth - viewportWidth;
      
      console.log('📱 页面宽度检查:', {
        bodyScrollWidth,
        viewportWidth,
        overflow,
        hasHorizontalScroll: overflow > 0
      });
      
      // 查找所有宽度超出视口的元素
      const allElements = document.querySelectorAll('*');
      const overflowElements: Array<{
        element: Element;
        tagName: string;
        className: string;
        width: number;
        overflow: number;
      }> = [];
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width > viewportWidth) {
          overflowElements.push({
            element,
            tagName: element.tagName,
            className: element.className,
            width: rect.width,
            overflow: rect.width - viewportWidth
          });
        }
      });
      
      console.log('🚨 发现溢出元素:', overflowElements);
      return overflowElements;
    }
  };
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('click', handleImageClick);
  
  // 重置导航栏状态
  isHeaderScrolled.value = false;
  lastScrollY.value = 0;
  
  // 清空Sidebar中的文章内容
  emit('article-content-updated', {
    content: '',
    path: route.path
  });
});
</script>

<style scoped>
/* ===== 基础样式 ===== */
.article-page {
  @apply min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30;
  @apply dark:from-slate-900 dark:via-slate-800 dark:to-gray-900;
  background-attachment: fixed;
  position: relative;
  /* 移除overflow限制以支持sticky定位 */
  max-width: 100vw;
}

/* 移动端视口高度修复 */
@supports not (height: 100dvh) {
  .article-page {
    min-height: 100vh;
  }
}

/* 移动端背景优化 */
@media (max-width: 767px) {
  .article-page {
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(135deg, rgb(248 250 252) 0%, rgb(239 246 255) 50%, rgb(238 242 255) 100%);
    /* 🔧 修复sticky定位：移动端也不能有overflow-y限制 */
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: visible; /* 确保垂直方向不限制滚动，支持sticky */
    /* 强制覆盖可能的overflow简写属性 */
    overflow: visible;
    overflow-x: hidden !important;
    overflow-y: visible !important;
  }
  
  .dark .article-page {
    background: linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 50%, rgb(17 24 39) 100%);
  }
}

/* ===== 阅读进度条 ===== */
.reading-progress {
  @apply fixed top-0 left-0 w-full h-1 bg-gray-200/70 dark:bg-gray-700/70 z-[60];
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.progress-bar {
  @apply h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
  border-radius: 0 2px 2px 0;
}

/* ===== 顶部导航 ===== */
.article-header {
  @apply sticky bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60;
  top: 1px; /* 在阅读进度条下方 */
  z-index: 60; /* 🔧 提高z-index，确保在侧边栏(z-50)之上 */
  min-height: 64px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transform: translateY(0);
}

/* 滚动后的导航栏状态 - 类似灵动岛 */
.article-header.header-scrolled {
  @apply bg-white/95 dark:bg-gray-900/95;
  min-height: 56px;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 0 0 24px 24px;
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .article-header.header-scrolled {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 移除了隐藏状态CSS - 导航栏始终显示 */

.header-container {
  @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between;
  min-height: 64px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 紧凑模式容器 */
.header-container.container-compact {
  @apply py-2;
  min-height: 56px;
}

.back-btn {
  @apply flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-200 font-semibold;
  @apply bg-gradient-to-r from-white/90 via-gray-50/90 to-white/90;
  @apply dark:from-gray-800/90 dark:via-gray-700/90 dark:to-gray-800/90;
  @apply border border-gray-200/70 dark:border-gray-600/70;
  @apply rounded-2xl transition-all duration-300 ease-out;
  @apply hover:from-blue-50/95 hover:via-indigo-50/95 hover:to-purple-50/95;
  @apply dark:hover:from-blue-900/60 dark:hover:via-indigo-900/60 dark:hover:to-purple-900/60;
  @apply hover:text-blue-700 dark:hover:text-blue-300;
  @apply hover:border-blue-300/70 dark:hover:border-blue-600/70;
  @apply hover:shadow-lg hover:shadow-blue-500/20;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2;
  @apply active:scale-95 relative overflow-hidden;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-btn::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10;
  @apply opacity-0 transition-opacity duration-300;
  border-radius: inherit;
}

.back-btn:hover::before {
  @apply opacity-100;
}

.back-btn:hover {
  transform: translateX(-3px) translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-icon {
  @apply w-5 h-5 transition-all duration-300 ease-out;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.back-btn:hover .back-icon {
  transform: translateX(-2px) scale(1.05);
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
}

.back-text {
  @apply text-sm font-semibold tracking-wide transition-all duration-300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.back-btn:hover .back-text {
  transform: translateX(-1px);
  text-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
}

/* ===== 动态标题 ===== */
.header-title {
  @apply flex-1 mx-6 overflow-hidden;
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.header-title.title-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.header-title h1 {
  @apply text-lg font-bold text-gray-900 dark:text-white truncate;
  @apply bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900;
  @apply dark:from-white dark:via-blue-100 dark:to-indigo-100;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1.3;
  max-width: 100%;
}

/* ===== 阅读进度指示器 ===== */
.header-progress {
  @apply flex items-center justify-center;
  opacity: 0;
  transform: translateX(20px) scale(0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-progress.progress-visible {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.progress-circle {
  @apply relative flex items-center justify-center;
  width: 40px;
  height: 40px;
}

.progress-ring {
  @apply w-full h-full;
  transform: rotate(-90deg);
  transition: all 0.3s ease;
}

.progress-ring-bg {
  @apply text-gray-300 dark:text-gray-600;
  opacity: 0.3;
}

.progress-ring-fill {
  @apply text-blue-500 dark:text-blue-400;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
}

.progress-text {
  @apply absolute inset-0 flex items-center justify-center text-xs font-bold;
  @apply text-blue-600 dark:text-blue-400;
  font-size: 10px;
  line-height: 1;
}

/* 进度圈悬停效果 */
.progress-circle:hover {
  transform: scale(1.1);
}

.progress-circle:hover .progress-ring-fill {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
}

/* 移动端目录按钮已移除，目录现在在左侧导航栏中 */

/* ===== 主要内容区域 ===== */
.article-main {
  @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8;
  min-height: calc(100vh - 65px); /* 减去header高度+进度条高度 */
  min-height: calc(100dvh - 65px); /* 动态视口高度支持 */
  /* 确保sticky定位正常工作 */
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  /* 桌面端不使用overflow-x: hidden，以免影响sticky */
  position: relative;
}

.main-container {
  @apply flex gap-6 lg:gap-10;
  /* 移动端容器优化 - 强化版 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  /* 现在只有单列布局，因为目录移到左侧导航栏了 */
  flex-direction: column;
  /* 桌面端保持正常overflow以支持sticky定位 */
  overflow: visible;
}

/* 移动端强制单列布局 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column !important;
    gap: 0 !important;
  }
}

.article-content-wrapper {
  @apply flex-1 min-w-0;
  /* 确保内容不会溢出 - 强化版 */
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  /* 移动端优先设计 */
  width: 100%;
}

/* 移动端文章容器特殊优化 */
@media (max-width: 768px) {
  .article-content-wrapper {
    flex: none !important;
    width: 100% !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }
}

/* ===== 加载状态 ===== */
.loading-state {
  @apply flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400;
  animation: fade-in 0.3s ease-out;
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin mb-6;
  filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3));
}

.loading-text {
  @apply text-sm font-medium;
}

/* ===== 文章内容 ===== */
.article-content {
  @apply bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: content-appear 0.4s ease-out;
  /* 防止内容溢出 - 移动端强化 */
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  /* 移动端特殊处理 */
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .article-content {
    border-radius: 1rem; /* 减少圆角 */
    margin: 0;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

.article-content-header {
  @apply p-6 sm:p-8 lg:p-10 border-b border-gray-100/70 dark:border-gray-700/70;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(248,250,252,0.05) 100%);
  /* 防止头部内容溢出 */
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.article-title {
  @apply text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6;
  @apply break-words;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* 强制文字换行 - 移动端强化 */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  width: 100%;
  hyphens: auto;
  box-sizing: border-box;
  /* 移动端特殊处理 */
  line-height: 1.2;
}

@media (max-width: 768px) {
  .article-title {
    @apply text-xl sm:text-2xl font-bold mb-4;
    line-height: 1.3;
    /* 移动端强制适配 */
    max-width: calc(100vw - 2rem);
    width: calc(100% - 2rem);
  }
}

@media (max-width: 480px) {
  .article-title {
    @apply text-lg font-bold mb-3;
    line-height: 1.35;
    /* 超小屏幕严格控制 */
    max-width: calc(100vw - 1rem);
    width: calc(100% - 1rem);
    font-size: 1.125rem !important;
  }
}

.dark .article-title {
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.article-meta {
  @apply space-y-4;
  /* 防止meta信息溢出 */
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.meta-row {
  @apply flex items-center gap-3 text-sm;
  /* 确保meta行不溢出 */
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.meta-row.primary {
  @apply text-gray-600 dark:text-gray-400;
  flex-wrap: wrap;
  gap: 0.75rem;
  /* 移动端优化 */
  width: 100%;
  max-width: 100%;
}

.meta-row.secondary {
  @apply justify-between items-center;
  /* 防止secondary行溢出 */
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-item {
  @apply font-medium flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg;
  @apply border border-gray-200/50 dark:border-gray-600/50;
  transition: all 0.2s ease;
  /* 防止meta项目溢出 */
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex-shrink: 1;
  min-width: 0;
}

.meta-item:hover {
  @apply bg-gray-100/80 dark:bg-gray-600/50;
  transform: translateY(-1px);
}

.meta-icon {
  @apply w-4 h-4 opacity-80;
}

.meta-divider {
  @apply w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0;
}

.meta-category-tags {
  @apply flex items-center gap-3 flex-wrap;
}

.meta-category {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30;
  @apply text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-xl border border-blue-200/60 dark:border-blue-800/60;
  @apply shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105;
}

.category-icon {
  @apply w-4 h-4;
}

.article-tags-inline {
  @apply flex flex-wrap gap-2;
}

.article-tags-inline .tag {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-xs;
  @apply transition-all duration-300 ease-out cursor-pointer relative overflow-hidden;
  @apply rounded-xl border shadow-sm hover:shadow-lg;
  position: relative;
  
  /* 使用CSS变量来实现多种颜色主题 */
  --tag-from: 59, 130, 246;  /* blue-500 */
  --tag-to: 99, 102, 241;    /* indigo-500 */
  --tag-accent: 147, 51, 234; /* purple-500 */
  
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.08) 0%, 
    rgba(var(--tag-to), 0.12) 50%, 
    rgba(var(--tag-accent), 0.08) 100%);
  
  color: rgb(var(--tag-from));
  border: 1px solid rgba(var(--tag-from), 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.article-tags-inline .tag .tag-icon {
  @apply w-3 h-3;
}

/* 为内联标签分配不同颜色 */
.article-tags-inline .tag:nth-child(2) {
  --tag-from: 16, 185, 129;   /* green-500 */
  --tag-to: 34, 197, 94;      /* green-500 */
  --tag-accent: 6, 182, 212;  /* cyan-500 */
}

.article-tags-inline .tag:nth-child(3) {
  --tag-from: 245, 101, 101;  /* red-400 */
  --tag-to: 251, 113, 133;    /* rose-400 */
  --tag-accent: 249, 115, 22; /* orange-500 */
}

.article-tags-inline .tag:nth-child(4) {
  --tag-from: 139, 69, 19;    /* amber-800 */
  --tag-to: 217, 119, 6;      /* amber-600 */
  --tag-accent: 245, 158, 11; /* amber-500 */
}

.article-tags-inline .tag:nth-child(5) {
  --tag-from: 219, 39, 119;   /* pink-600 */
  --tag-to: 147, 51, 234;     /* purple-500 */
  --tag-accent: 168, 85, 247; /* purple-400 */
}

/* 暗色模式调整 */
.dark .article-tags-inline .tag {
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.15) 0%, 
    rgba(var(--tag-to), 0.2) 50%, 
    rgba(var(--tag-accent), 0.15) 100%);
  
  color: rgba(var(--tag-from), 0.9);
  border: 1px solid rgba(var(--tag-from), 0.3);
}

/* 悬停效果 */
.article-tags-inline .tag:hover {
  transform: translateY(-1px) scale(1.02);
  border-color: rgba(var(--tag-from), 0.4);
  
  box-shadow: 
    0 4px 12px rgba(var(--tag-from), 0.15),
    0 2px 6px rgba(var(--tag-to), 0.1);
}

.dark .article-tags-inline .tag:hover {
  border-color: rgba(var(--tag-from), 0.5);
  box-shadow: 
    0 4px 12px rgba(var(--tag-from), 0.2),
    0 2px 6px rgba(var(--tag-to), 0.15);
}

.edit-btn {
  @apply flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300;
  @apply bg-gray-50/80 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-600/50;
  @apply transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50;
  @apply border border-gray-200/50 dark:border-gray-600/50 hover:scale-105 active:scale-95;
}

.edit-icon {
  @apply w-4 h-4;
}

.article-tags {
  @apply flex flex-wrap gap-3 mt-6;
}

.tag {
  @apply inline-flex items-center gap-2.5 px-4 py-2.5 font-semibold text-sm;
  @apply transition-all duration-300 ease-out cursor-pointer relative overflow-hidden;
  @apply rounded-2xl border shadow-md hover:shadow-xl;
  position: relative;
  
  /* 使用CSS变量来实现多种颜色主题 */
  --tag-from: 59, 130, 246;  /* blue-500 */
  --tag-to: 99, 102, 241;    /* indigo-500 */
  --tag-accent: 147, 51, 234; /* purple-500 */
  
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.08) 0%, 
    rgba(var(--tag-to), 0.12) 50%, 
    rgba(var(--tag-accent), 0.08) 100%);
  
  color: rgb(var(--tag-from));
  border: 1px solid rgba(var(--tag-from), 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 为不同位置的标签分配不同颜色 */
.tag:nth-child(2) {
  --tag-from: 16, 185, 129;   /* green-500 */
  --tag-to: 34, 197, 94;      /* green-500 */
  --tag-accent: 6, 182, 212;  /* cyan-500 */
}

.tag:nth-child(3) {
  --tag-from: 245, 101, 101;  /* red-400 */
  --tag-to: 251, 113, 133;    /* rose-400 */
  --tag-accent: 249, 115, 22; /* orange-500 */
}

.tag:nth-child(4) {
  --tag-from: 139, 69, 19;    /* amber-800 */
  --tag-to: 217, 119, 6;      /* amber-600 */
  --tag-accent: 245, 158, 11; /* amber-500 */
}

.tag:nth-child(5) {
  --tag-from: 219, 39, 119;   /* pink-600 */
  --tag-to: 147, 51, 234;     /* purple-500 */
  --tag-accent: 168, 85, 247; /* purple-400 */
}

.tag:nth-child(6) {
  --tag-from: 14, 165, 233;   /* sky-500 */
  --tag-to: 6, 182, 212;      /* cyan-500 */
  --tag-accent: 34, 197, 94;  /* green-500 */
}

/* 暗色模式调整 */
.dark .tag {
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.15) 0%, 
    rgba(var(--tag-to), 0.2) 50%, 
    rgba(var(--tag-accent), 0.15) 100%);
  
  color: rgba(var(--tag-from), 0.9);
  border: 1px solid rgba(var(--tag-from), 0.3);
}

/* 悬停效果 */
.tag::before {
  content: '';
  @apply absolute inset-0 transition-opacity duration-300 opacity-0;
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.15) 0%, 
    rgba(var(--tag-to), 0.2) 50%, 
    rgba(var(--tag-accent), 0.15) 100%);
  border-radius: inherit;
}

.tag:hover::before {
  @apply opacity-100;
}

.dark .tag:hover::before {
  background: linear-gradient(135deg, 
    rgba(var(--tag-from), 0.25) 0%, 
    rgba(var(--tag-to), 0.3) 50%, 
    rgba(var(--tag-accent), 0.25) 100%);
}

.tag:hover {
  transform: translateY(-2px) scale(1.05);
  border-color: rgba(var(--tag-from), 0.4);
  
  box-shadow: 
    0 10px 25px rgba(var(--tag-from), 0.15),
    0 4px 12px rgba(var(--tag-to), 0.1),
    0 0 0 1px rgba(var(--tag-from), 0.1);
}

.dark .tag:hover {
  border-color: rgba(var(--tag-from), 0.5);
  box-shadow: 
    0 10px 25px rgba(var(--tag-from), 0.2),
    0 4px 12px rgba(var(--tag-to), 0.15),
    0 0 0 1px rgba(var(--tag-from), 0.2);
}

.tag:active {
  transform: translateY(-1px) scale(1.02);
}

.tag-icon {
  @apply w-4 h-4 transition-all duration-300 ease-out;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  opacity: 0.8;
}

.tag:hover .tag-icon {
  transform: rotate(12deg) scale(1.1);
  opacity: 1;
  filter: drop-shadow(0 2px 4px rgba(var(--tag-from), 0.3));
}

/* 标签文字动画 */
.tag span {
  @apply relative z-10 transition-all duration-300;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.tag:hover span {
  transform: translateX(1px);
  font-weight: 700;
}

/* ===== 文章摘要 ===== */
.article-summary {
  @apply px-6 sm:px-8 lg:px-10 py-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90;
  @apply dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30;
  @apply border-b border-gray-100/60 dark:border-gray-700/60;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.summary-content {
  @apply flex gap-5 items-start;
}

.summary-icon-wrapper {
  @apply w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600;
  @apply rounded-2xl shadow-lg flex-shrink-0;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.summary-icon {
  @apply w-6 h-6 text-white;
}

.summary-text {
  @apply flex-1;
}

.summary-title {
  @apply text-base font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide;
  background: linear-gradient(135deg, #1f2937 0%, #4f46e5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark .summary-title {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary-text p {
  @apply text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium;
}

/* ===== 文章正文 ===== */
.article-body {
  @apply p-6 sm:p-8 lg:p-10;
}

.no-content {
  @apply flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 space-y-4;
}

.no-content-icon {
  @apply w-16 h-16 opacity-30;
}

.no-content p {
  @apply text-base italic font-medium;
}

/* ===== 文章底部 ===== */
.article-footer {
  @apply px-6 sm:px-8 lg:px-10 py-6 border-t border-gray-100/70 dark:border-gray-700/70;
  @apply bg-gradient-to-r from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-700/90;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.actions {
  @apply flex gap-4 justify-center flex-wrap;
}

.action-btn {
  @apply flex items-center gap-3 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 active:scale-95;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.like-btn {
  @apply bg-gradient-to-r from-red-50/90 to-pink-50/90 dark:from-red-900/40 dark:to-pink-900/40;
  @apply text-red-600 dark:text-red-400 hover:from-red-100/90 hover:to-pink-100/90;
  @apply dark:hover:from-red-900/60 dark:hover:to-pink-900/60;
  @apply border border-red-200/60 dark:border-red-800/60 focus:ring-red-500/50;
  @apply shadow-lg hover:shadow-xl;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.15);
}

.like-btn:hover {
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.25);
}

.edit-action-btn {
  @apply bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:to-indigo-900/40;
  @apply text-blue-600 dark:text-blue-400 hover:from-blue-100/90 hover:to-indigo-100/90;
  @apply dark:hover:from-blue-900/60 dark:hover:to-indigo-900/60;
  @apply border border-blue-200/60 dark:border-blue-800/60 focus:ring-blue-500/50;
  @apply shadow-lg hover:shadow-xl;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.edit-action-btn:hover {
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.25);
}

.action-icon {
  @apply w-5 h-5;
}

.action-text {
  @apply text-sm font-semibold;
}

.action-count {
  @apply px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 text-xs font-bold rounded-full;
  @apply shadow-md border border-gray-200/50 dark:border-gray-600/50;
}

/* ===== 文章不存在 ===== */
.not-found {
  @apply bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60;
  @apply flex items-center justify-center py-24;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  animation: content-appear 0.4s ease-out;
}

.not-found-content {
  @apply text-center space-y-8 max-w-md;
}

.not-found-icon-wrapper {
  @apply w-24 h-24 mx-auto mb-6 flex items-center justify-center;
  @apply bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600;
  @apply rounded-full shadow-lg;
  animation: float 3s ease-in-out infinite;
}

.not-found-icon {
  @apply w-12 h-12 text-gray-500 dark:text-gray-400;
}

.not-found-content h2 {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.not-found-content p {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

.back-to-list-btn {
  @apply inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600;
  @apply hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold;
  @apply transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2;
  @apply hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
}

.back-to-list-btn:hover {
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.35);
}

.btn-icon {
  @apply w-5 h-5;
}

/* ===== 右侧目录已移至左侧导航栏 ===== */

/* ===== 移动端目录已移至左侧导航栏 ===== */

/* ===== 移动端灵动岛效果 ===== */
@media (max-width: 768px) {
  /* 移动端导航栏滚动后的灵动岛效果 */
  .article-header.header-scrolled {
    @apply bg-white/95 dark:bg-gray-900/95;
    min-height: 52px;
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-radius: 0 0 20px 20px; /* 移动端稍小的圆角 */
    border-color: rgba(255, 255, 255, 0.2);
  }

  .dark .article-header.header-scrolled {
    box-shadow: 
      0 6px 25px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* 移动端紧凑模式容器 */
  .header-container.container-compact {
    @apply py-1.5;
    min-height: 52px;
  }
}

/* ===== 移动端全局保护 ===== */
@media (max-width: 768px) {
  /* 🔧 强制修复移动端sticky定位问题 */
  .article-page {
    max-width: 100vw !important;
    overflow-x: hidden !important;
    overflow-y: visible !important; /* 🚨 关键修复：必须是visible才能支持sticky */
    overflow: visible !important; /* 强制覆盖简写属性 */
    position: relative;
  }
  
  /* 强制移除所有可能的overflow限制 */
  .article-page,
  .article-page * {
    /* 确保没有任何父容器限制sticky定位 */
    -webkit-overflow-scrolling: touch;
  }
  
  /* 全局防溢出保护 - 加强版 */
  
  .article-page * {
    max-width: 100% !important;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
  }
  
  /* 防止长单词溢出 */
  p, div, span, h1, h2, h3, h4, h5, h6, article, section {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    max-width: 100% !important;
  }
  
  /* 强制特定flex容器在移动端正确表现，但排除会影响sticky的容器 */
  .article-content-wrapper,
  .meta-row,
  .actions {
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  /* 移动端导航栏确保sticky */
  .article-header {
    position: sticky !important;
    top: 1px !important;
    z-index: 50 !important;
  }
}

/* ===== 响应式设计 - 强化版 ===== */
@media (max-width: 768px) {
  .article-main {
    @apply px-3 py-4;
    min-height: calc(100vh - 65px);
    min-height: calc(100dvh - 65px);
    /* 移动端溢出保护 */
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden; /* 移动端需要防止溢出 */
    box-sizing: border-box;
    margin: 0;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .main-container {
    @apply gap-0;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    /* 移动端才应用overflow限制 */
    overflow-x: hidden;
  }
  
  .article-content {
    @apply rounded-xl shadow-lg;
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
  
  .article-content-header {
    @apply p-4 sm:p-5;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .article-meta {
    @apply space-y-3;
    width: 100%;
    max-width: 100%;
  }
  
  .meta-row.primary {
    @apply flex-col items-start gap-2;
    width: 100%;
    max-width: 100%;
  }
  
  .meta-item {
    @apply px-2.5 py-1;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .meta-row.secondary {
    @apply flex-col items-start gap-3;
    width: 100%;
    max-width: 100%;
  }
  
  .meta-category, .edit-btn {
    @apply text-xs px-3 py-1.5;
    max-width: 100%;
  }
  
  .article-tags {
    @apply gap-2.5 mt-4;
    flex-wrap: wrap;
    width: 100%;
    max-width: 100%;
  }
  
  .tag {
    @apply px-3 py-2 text-xs;
    max-width: 100%;
    word-wrap: break-word;
    font-weight: 600;
  }
  
  .tag-icon {
    @apply w-3.5 h-3.5;
  }
  
  .article-summary {
    @apply px-4 py-4;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .summary-content {
    @apply gap-4;
    width: 100%;
    max-width: 100%;
  }
  
  .summary-icon-wrapper {
    @apply w-10 h-10;
    flex-shrink: 0;
  }
  
  .summary-icon {
    @apply w-5 h-5;
  }
  
  .summary-title {
    @apply text-sm mb-2;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .article-body {
    @apply p-4 sm:p-5;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  
  .article-footer {
    @apply px-4 py-4;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .actions {
    @apply flex-col gap-3;
    width: 100%;
    max-width: 100%;
  }
  
  .action-btn {
    @apply w-full justify-center py-3.5 gap-2;
    max-width: 100%;
  }
  
  .header-container {
    @apply px-3 py-2.5;
    min-height: 60px;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .header-container.container-compact {
    @apply py-2;
    min-height: 52px;
  }
  
  .header-title {
    @apply mx-3;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 移动端灵动岛模式下的标题优化 */
  .header-scrolled .header-title {
    @apply mx-2;
  }
  
  .header-title h1 {
    @apply text-base;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .header-scrolled .header-title h1 {
    @apply text-sm;
  }
  
  .progress-circle {
    width: 32px;
    height: 32px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 移动端灵动岛模式下的进度圈优化 */
  .header-scrolled .progress-circle {
    width: 30px;
    height: 30px;
  }
  
  .progress-text {
    font-size: 9px;
    transition: font-size 0.4s ease;
  }
  
  .header-scrolled .progress-text {
    font-size: 8px;
  }
  
  .back-btn {
    @apply px-3 py-2 text-sm;
    max-width: 100%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 移动端灵动岛模式下的返回按钮优化 */
  .header-scrolled .back-btn {
    @apply px-2.5 py-1.5;
  }
  
  .back-text {
    @apply hidden sm:inline;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕灵动岛效果 */
  .article-header.header-scrolled {
    @apply bg-white/95 dark:bg-gray-900/95;
    min-height: 48px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    border-radius: 0 0 16px 16px; /* 超小屏幕更小的圆角 */
    border-color: rgba(255, 255, 255, 0.2);
  }

  .dark .article-header.header-scrolled {
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* 超小屏幕紧凑模式容器 */
  .header-container.container-compact {
    @apply py-1;
    min-height: 48px;
  }

  /* 超小屏幕全局保护 - 强化版 */
  * {
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }
  
  .mobile-toc-drawer {
    @apply w-full max-w-none;
    max-width: 100vw !important;
  }
  
  /* 超小屏幕导航栏确保sticky */
  .article-header {
    position: sticky !important;
    top: 1px !important;
    z-index: 50 !important;
  }
  
  .article-main {
    @apply px-2 py-3;
    min-height: calc(100vh - 61px);
    min-height: calc(100dvh - 61px);
    /* 超小屏幕严格控制 - 强化版 */
    max-width: 100vw !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    margin: 0 !important;
  }
  
  .main-container {
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .article-content {
    max-width: calc(100vw - 1rem) !important;
    margin: 0 !important;
    border-radius: 0.75rem !important;
  }
  
  .article-content-header {
    @apply p-3;
    max-width: 100% !important;
  }
  
  .article-summary {
    @apply px-3 py-3;
    max-width: 100% !important;
  }
  
  .article-body {
    @apply p-3;
    max-width: 100% !important;
  }
  
  .article-footer {
    @apply px-3 py-3;
    max-width: 100% !important;
  }
  
  .header-container {
    @apply px-2 py-2;
    min-height: 56px;
    max-width: 100vw !important;
  }
  
  .header-container.container-compact {
    @apply py-1.5;
    min-height: 48px;
  }
  
  .header-title {
    @apply mx-2;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 超小屏幕灵动岛模式下的标题优化 */
  .header-scrolled .header-title {
    @apply mx-1.5;
  }
  
  .header-title h1 {
    @apply text-sm;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .header-scrolled .header-title h1 {
    @apply text-xs;
  }
  
  .progress-circle {
    width: 28px;
    height: 28px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 超小屏幕灵动岛模式下的进度圈优化 */
  .header-scrolled .progress-circle {
    width: 26px;
    height: 26px;
  }
  
  .progress-text {
    font-size: 8px;
    transition: font-size 0.4s ease;
  }
  
  .header-scrolled .progress-text {
    font-size: 7px;
  }
  
  .back-btn {
    @apply px-3 py-2 text-xs;
    gap: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 超小屏幕灵动岛模式下的返回按钮优化 */
  .header-scrolled .back-btn {
    @apply px-2 py-1.5 text-xs;
    gap: 0.25rem;
  }
  
  .back-text {
    @apply hidden;
  }
  
  .tag {
    @apply px-2.5 py-1.5 text-xs gap-2;
    font-weight: 600;
    max-width: calc(100% - 0.5rem);
  }
  
  .tag-icon {
    @apply w-3 h-3;
  }
}

/* ===== 动画 ===== */
@keyframes fade-in {
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
}

@keyframes slide-in-right {
  from { 
    transform: translateX(100%); 
    opacity: 0;
  }
  to { 
    transform: translateX(0); 
    opacity: 1;
  }
}

@keyframes content-appear {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-10px);
  }
}

@keyframes progress-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

/* 性能优化 - 启用硬件加速 */
.article-header,
.header-title,
.header-progress,
.back-btn {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 减弱动画对于偏好减少动画的用户 */
@media (prefers-reduced-motion: reduce) {
  .article-header,
  .header-container,
  .header-title,
  .header-progress,
  .back-btn,
  .progress-circle {
    transition-duration: 0.1s;
  }
  
  .progress-circle:hover {
    transform: none;
  }
}

/* ===== Markdown 内容样式 ===== */
:deep(.md-editor-v3) {
  @apply bg-transparent;
}

:deep(.md-editor-v3-preview) {
  @apply bg-transparent p-0;
}

/* 🔧 修复移动端代码块溢出问题 */
:deep(.md-editor-code-block) {
  @apply inline-block;
  max-width: 100% !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  overflow-x: hidden !important;
}

:deep(.md-editor-v3-html) {
  @apply bg-transparent text-gray-800 dark:text-gray-200 leading-relaxed;
  font-size: 17px;
  line-height: 1.8;
  color: #374151;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  /* 防止Markdown内容溢出 */
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

:deep(.dark .md-editor-v3-html) {
  color: #d1d5db;
}

:deep(.md-editor-v3-html h1) {
  @apply text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6;
  line-height: 1.3;
  background: linear-gradient(135deg, #1f2937 0%, #4f46e5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.dark .md-editor-v3-html h1) {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.md-editor-v3-html h2) {
  @apply text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-5;
  line-height: 1.3;
  background: linear-gradient(135deg, #374151 0%, #6366f1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.dark .md-editor-v3-html h2) {
  background: linear-gradient(135deg, #f3f4f6 0%, #a5b4fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.md-editor-v3-html h3) {
  @apply text-xl font-bold text-gray-900 dark:text-white mt-7 mb-4;
  line-height: 1.4;
}

:deep(.md-editor-v3-html h4) {
  @apply text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3;
  line-height: 1.4;
}

:deep(.md-editor-v3-html h5) {
  @apply text-base font-semibold text-gray-900 dark:text-white mt-5 mb-2;
}

:deep(.md-editor-v3-html h6) {
  @apply text-sm font-semibold text-gray-900 dark:text-white mt-4 mb-2;
}

:deep(.md-editor-v3-html p) {
  @apply mb-6 leading-relaxed;
  text-align: justify;
  word-spacing: 0.05em;
}

:deep(.md-editor-v3-html blockquote) {
  @apply border-l-4 border-indigo-500 dark:border-indigo-400 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/30 dark:to-blue-900/30;
  @apply pl-6 py-4 my-6 italic text-indigo-800 dark:text-indigo-200 rounded-r-xl;
  border-radius: 0 12px 12px 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

:deep(.md-editor-v3-html code) {
  @apply px-2.5 py-1.5 bg-gray-100/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100;
  @apply text-sm rounded-lg font-mono border border-gray-200/50 dark:border-gray-600/50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  /* 防止内联代码溢出 */
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  /* 改善对比度 */
  color: #1f2937;
}

:deep(.dark .md-editor-v3-html code) {
  color: #f9fafb;
}

:deep(.md-editor-v3-html pre) {
  @apply p-6 bg-gray-50/90 dark:bg-gray-800/90 rounded-xl overflow-x-auto my-6;
  @apply border border-gray-200/60 dark:border-gray-700/60;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /* 优化代码块滚动 */
  width: 100%;
  max-width: 100%;
  overflow-y: visible;
  /* 移动端滚动优化 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* 移动端代码块特殊优化 */
@media (max-width: 768px) {
  :deep(.md-editor-v3-html pre) {
    @apply p-4 my-4 rounded-lg;
    /* 移动端严格控制代码块宽度 */
    max-width: calc(100vw - 2rem) !important;
    width: calc(100vw - 2rem) !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    /* 优化移动端滚动体验 */
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    /* 改善可读性 */
    font-size: 14px;
    line-height: 1.4;
  }
}

:deep(.md-editor-v3-html pre code) {
  @apply bg-transparent p-0 border-0 shadow-none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  /* 代码块内代码优化 */
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
  display: block;
  width: max-content;
  min-width: 100%;
}

:deep(.md-editor-v3-html img) {
  @apply max-w-full h-auto rounded-xl shadow-lg my-6 cursor-pointer;
  @apply hover:shadow-xl transition-all duration-300 hover:scale-[1.02];
  border: 1px solid rgba(0, 0, 0, 0.1);
  /* 严格防止图片溢出 */
  width: auto;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain;
  display: block;
}

:deep(.dark .md-editor-v3-html img) {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.md-editor-v3-html table) {
  @apply w-full border-collapse my-6 rounded-xl overflow-hidden;
  @apply border border-gray-200/60 dark:border-gray-600/60;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  /* 防止表格溢出 */
  max-width: 100%;
  width: 100%;
}

/* 表格容器优化 - 在768px以下就开始处理 */
@media (max-width: 768px) {
  :deep(.md-editor-v3-html table) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
}

:deep(.md-editor-v3-html th),
:deep(.md-editor-v3-html td) {
  @apply border-0 px-4 py-3 text-left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

:deep(.dark .md-editor-v3-html th),
:deep(.dark .md-editor-v3-html td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.md-editor-v3-html th) {
  @apply bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 font-bold text-gray-900 dark:text-white;
}

:deep(.md-editor-v3-html td) {
  @apply bg-white/50 dark:bg-gray-800/50;
}

:deep(.md-editor-v3-html ul),
:deep(.md-editor-v3-html ol) {
  @apply pl-6 mb-6 space-y-2;
}

:deep(.md-editor-v3-html li) {
  @apply leading-relaxed;
  position: relative;
}

:deep(.md-editor-v3-html ul li::before) {
  content: "•";
  @apply absolute -left-4 text-indigo-500 dark:text-indigo-400 font-bold;
}

:deep(.md-editor-v3-html ol li) {
  counter-increment: list-counter;
}

:deep(.md-editor-v3-html ol li::before) {
  content: counter(list-counter) ".";
  @apply absolute -left-6 text-indigo-500 dark:text-indigo-400 font-bold;
}

:deep(.md-editor-v3-html ol) {
  counter-reset: list-counter;
}

:deep(.md-editor-v3-html a) {
  @apply text-indigo-600 dark:text-indigo-400 font-medium transition-colors duration-200;
  @apply hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

:deep(.md-editor-v3-html a:hover) {
  text-decoration-color: currentColor;
}

/* 移动端 Markdown 优化 */
@media (max-width: 768px) {
  :deep(.md-editor-v3-html) {
    font-size: 16px;
    line-height: 1.7;
  }
  
  /* 🔧 移动端代码块溢出强化修复 */
  :deep(.md-editor-code-block) {
    max-width: calc(100vw - 3rem) !important;
    width: auto !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    word-break: break-all !important;
    white-space: pre-wrap !important;
    overflow-x: hidden !important;
    display: inline-block !important;
    box-sizing: border-box !important;
  }
  
  :deep(.md-editor-v3-html h1) {
    @apply text-2xl mt-8 mb-4;
  }
  
  :deep(.md-editor-v3-html h2) {
    @apply text-xl mt-6 mb-4;
  }
  
  :deep(.md-editor-v3-html h3) {
    @apply text-lg mt-5 mb-3;
  }
  
  :deep(.md-editor-v3-html h4) {
    @apply text-base mt-4 mb-2;
  }
  
  :deep(.md-editor-v3-html p) {
    @apply mb-5;
  }
  
  :deep(.md-editor-v3-html blockquote) {
    @apply pl-4 py-3 my-4 text-sm;
  }
  
  :deep(.md-editor-v3-html code) {
    @apply px-2 py-1 text-sm;
  }
  
  :deep(.md-editor-v3-html pre) {
    @apply p-4 text-sm my-4;
    /* 移动端代码块优化 */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.7) transparent;
    max-width: calc(100vw - 2rem);
    width: 100%;
  }
  
  /* 代码块滚动条样式优化 */
  :deep(.md-editor-v3-html pre::-webkit-scrollbar) {
    height: 8px;
  }
  
  :deep(.md-editor-v3-html pre::-webkit-scrollbar-track) {
    background: rgba(156, 163, 175, 0.2);
    border-radius: 4px;
  }
  
  :deep(.md-editor-v3-html pre::-webkit-scrollbar-thumb) {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 4px;
  }
  
  :deep(.md-editor-v3-html pre::-webkit-scrollbar-thumb:hover) {
    background: rgba(156, 163, 175, 0.7);
  }
  
  :deep(.md-editor-v3-html img) {
    @apply my-4 rounded-lg;
  }
  
  :deep(.md-editor-v3-html table) {
    @apply text-sm my-4;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  :deep(.md-editor-v3-html th),
  :deep(.md-editor-v3-html td) {
    @apply px-3 py-2;
  }
  
  :deep(.md-editor-v3-html ul),
  :deep(.md-editor-v3-html ol) {
    @apply pl-5 mb-4;
  }
}

@media (max-width: 480px) {
  :deep(.md-editor-v3-html) {
    font-size: 15px;
    line-height: 1.65;
  }
  
  :deep(.md-editor-v3-html h1) {
    @apply text-xl mt-6 mb-3;
  }
  
  :deep(.md-editor-v3-html h2) {
    @apply text-lg mt-5 mb-3;
  }
  
  :deep(.md-editor-v3-html h3) {
    @apply text-base mt-4 mb-2;
  }
  
  :deep(.md-editor-v3-html h4) {
    @apply text-sm mt-3 mb-2;
  }
  
  :deep(.md-editor-v3-html p) {
    @apply mb-4;
  }
  
  :deep(.md-editor-v3-html blockquote) {
    @apply pl-3 py-2 my-3 text-xs;
  }
  
  :deep(.md-editor-v3-html code) {
    @apply px-1.5 py-0.5 text-xs;
  }
  
  :deep(.md-editor-v3-html pre) {
    @apply p-3 text-xs my-3;
    /* 超小屏幕代码块特殊处理 */
    max-width: calc(100vw - 1rem);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  :deep(.md-editor-v3-html img) {
    @apply my-3 rounded-lg;
    /* 超小屏幕图片严格控制 */
    max-width: calc(100vw - 1rem) !important;
    width: auto !important;
    height: auto !important;
  }
  
  :deep(.md-editor-v3-html table) {
    @apply text-xs my-3;
    /* 超小屏幕表格处理 */
    max-width: calc(100vw - 1rem);
    font-size: 11px;
  }
  
  :deep(.md-editor-v3-html th),
  :deep(.md-editor-v3-html td) {
    @apply px-2 py-1.5;
  }
  
  :deep(.md-editor-v3-html ul),
  :deep(.md-editor-v3-html ol) {
    @apply pl-4 mb-3;
  }
}

/* ===== 删除功能相关样式 ===== */

/* 文章操作按钮容器 */
.article-actions {
  @apply flex gap-3 items-center;
}

/* 小版本删除按钮（meta区域） */
.delete-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50/90 to-rose-50/90;
  @apply dark:from-red-900/40 dark:to-rose-900/40 text-red-600 dark:text-red-400;
  @apply text-sm font-semibold rounded-xl border border-red-200/60 dark:border-red-800/60;
  @apply shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105;
  @apply hover:from-red-100/90 hover:to-rose-100/90 dark:hover:from-red-900/60 dark:hover:to-rose-900/60;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.delete-btn:hover {
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
}

.delete-icon {
  @apply w-4 h-4;
}

/* 大版本删除按钮（底部操作区） */
.delete-action-btn {
  @apply bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-900/40 dark:to-rose-900/40;
  @apply text-red-600 dark:text-red-400 hover:from-red-100/90 hover:to-rose-100/90;
  @apply dark:hover:from-red-900/60 dark:hover:to-rose-900/60;
  @apply border border-red-200/60 dark:border-red-800/60 focus:ring-red-500/50;
  @apply shadow-lg hover:shadow-xl;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.15);
}

.delete-action-btn:hover {
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.25);
}

/* 删除确认对话框 */
.delete-confirm-overlay {
  @apply fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-[100];
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: overlay-appear 0.3s ease-out;
}

.delete-confirm-modal {
  @apply bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60;
  @apply max-w-md mx-4 p-6 space-y-6;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  animation: modal-appear 0.3s ease-out;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.delete-confirm-header {
  @apply flex items-center gap-4 text-center;
  flex-direction: column;
}

.delete-confirm-icon {
  @apply w-16 h-16 text-red-500 dark:text-red-400 p-3;
  @apply bg-red-50/90 dark:bg-red-900/40 rounded-2xl;
  @apply border border-red-200/60 dark:border-red-800/60;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.delete-confirm-header h3 {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.delete-confirm-content {
  @apply space-y-3 text-center;
}

.delete-confirm-content p {
  @apply text-gray-700 dark:text-gray-300 leading-relaxed;
}

.delete-warning {
  @apply text-red-600 dark:text-red-400 text-sm font-medium !important;
  @apply bg-red-50/80 dark:bg-red-900/30 px-4 py-2 rounded-xl;
  @apply border border-red-200/60 dark:border-red-800/60;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.delete-confirm-actions {
  @apply flex gap-3 justify-end;
}

.cancel-btn {
  @apply px-6 py-3 bg-gray-50/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-100/90 dark:hover:bg-gray-600/90 font-semibold rounded-xl;
  @apply border border-gray-200/60 dark:border-gray-600/60 transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2;
  @apply hover:scale-105 active:scale-95;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.cancel-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.confirm-delete-btn {
  @apply px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600;
  @apply hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl;
  @apply transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2;
  @apply hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl;
  @apply flex items-center gap-2;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
}

.confirm-delete-btn:hover {
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.35);
}

.confirm-delete-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.loading-spinner {
  @apply w-4 h-4 animate-spin;
}

/* 动画效果 */
@keyframes overlay-appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .article-actions {
    @apply flex-col gap-2 items-start;
  }
  
  .delete-btn {
    @apply text-xs px-3 py-1.5;
  }
  
  .delete-confirm-modal {
    @apply mx-3 p-5 space-y-5;
  }
  
  .delete-confirm-header h3 {
    @apply text-lg;
  }
  
  .delete-confirm-icon {
    @apply w-12 h-12;
  }
  
  .delete-confirm-actions {
    @apply flex-col gap-2;
  }
  
  .cancel-btn,
  .confirm-delete-btn {
    @apply w-full justify-center;
  }
}
</style>