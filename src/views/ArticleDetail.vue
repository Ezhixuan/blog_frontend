<template>
  <div class="article-container">
    <!-- 阅读进度条 -->
    <div class="reading-progress-container">
      <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
    </div>
    
    <div class="article-layout">
      <!-- 文章内容 -->
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
              <a href="javascript:void(0)" class="meta-tag">{{ article.categoryName }}</a>
            </div>
            
            <div class="article-content">
              <!-- 使用摘要 -->
              <div v-if="article.summary" class="article-summary">
                {{ article.summary }}
              </div>
              
              <!-- 使用Markdown渲染内容，并启用目录功能 -->
              <v-md-preview 
                v-if="article.content" 
                ref="previewRef"
                :text="article.content" 
                :include-level="[1, 2, 3, 4]"
                @rendered="onContentRendered"
              />
              
              <!-- 无内容提示 -->
              <p v-if="!article.content" class="no-content-tip">文章详情内容暂未提供</p>
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
      
      <!-- 文章目录侧边栏 -->
      <div v-if="hasToc" class="article-toc-container">
        <div class="article-toc" ref="tocRef">
          <div class="toc-title">目录</div>
          <!-- 使用v-md-preview提供的目录API -->
          <div v-if="previewRef" class="markdown-toc">
            <div 
              v-for="(item, index) in previewRef.previewRef.tocItems" 
              :key="index"
              class="toc-item"
              :style="{ 'padding-left': item.level * 8 + 'px' }"
              :class="{ 'toc-active': item.active }"
              @click="scrollToTarget(item.anchor)"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleInfo } from '../api/generated/api/articleController';
import { emit } from '@/utils/eventBus';

// 定义目录项接口
interface TocItem {
  level: number;
  text: string;
  id: string;
  anchor: string;
}

const route = useRoute();
const router = useRouter();
const articleId = ref<string | null>(null);
const article = ref<API.ArticleInfoVO | null>(null);
const loading = ref(true);
const hasToc = ref(false);
const readingProgress = ref(0);
const previewRef = ref<any>(null);
const tocRef = ref<HTMLElement | null>(null);
const scrollElement = ref<HTMLElement | null>(null);

// 存储目录项的响应式引用
const tocItemsRef = ref<TocItem[]>([]);

// 计算目录项数据，用于传递给侧边栏
const tocItems = computed(() => {
  console.log('计算目录项数据:', previewRef.value);
  if (previewRef.value?.previewRef?.tocItems) {
    console.log('计算目录项数据:', previewRef.value.previewRef.tocItems);
    return previewRef.value.previewRef.tocItems;
  }
  return [];
});

// 滚动到目标锚点
const scrollToTarget = (anchor: string) => {
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// 计算阅读进度
const calculateReadingProgress = () => {
  if (!scrollElement.value) return;
  
  const scrollTop = scrollElement.value.scrollTop || document.documentElement.scrollTop;
  const scrollHeight = scrollElement.value.scrollHeight || document.documentElement.scrollHeight;
  const clientHeight = scrollElement.value.clientHeight || document.documentElement.clientHeight;
  
  // 计算阅读进度百分比
  const contentHeight = scrollHeight - clientHeight;
  const currentProgress = (scrollTop / contentHeight) * 100;
  
  // 确保进度在0-100之间
  readingProgress.value = Math.min(100, Math.max(0, currentProgress));
};

// 渲染完成后检查是否有标题并发送目录数据
const onContentRendered = () => {
  nextTick(() => {
    console.log('文章内容渲染完成，准备处理目录');
    
    // 如果预览组件存在且已经有内置的目录项
    if (previewRef.value?.previewRef?.tocItems && previewRef.value.previewRef.tocItems.length > 0) {
      console.log('使用预览组件内置的目录数据:', previewRef.value.previewRef.tocItems.length);
      hasToc.value = true;
      
      // 发送目录数据到Sidebar
      if (article.value) {
        console.log('发送内置目录数据到Sidebar');
        emit('article-toc-updated', {
          tocItems: previewRef.value.previewRef.tocItems,
          title: article.value.title || '文章',
          articleId: articleId.value
        });
      }
      return;
    }
    
    // 尝试不同的选择器找到标题元素
    let headers = document.querySelectorAll('.v-md-pre-wrapper h1, .v-md-pre-wrapper h2, .v-md-pre-wrapper h3, .v-md-pre-wrapper h4');
    
    // 如果找不到，尝试其他可能的选择器
    if (headers.length === 0) {
      headers = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4');
    }
    
    if (headers.length === 0) {
      headers = document.querySelectorAll('h1, h2, h3, h4');
    }
    
    console.log('找到的标题元素数量:', headers.length);
    hasToc.value = headers.length > 0;
    
    // 如果有标题元素，生成目录
    if (hasToc.value) {
      // 创建新的目录数组
      const newTocItems: TocItem[] = [];
      
      // 生成目录
      headers.forEach((header: Element, index: number) => {
        const htmlHeader = header as HTMLElement;
        const level = parseInt(htmlHeader.tagName.substring(1));
        const text = htmlHeader.textContent || `标题 ${index + 1}`;
        const id = `header-${index}`;
        
        // 为标题添加ID以供跳转
        htmlHeader.id = id;
        
        newTocItems.push({
          level,
          text,
          id,
          anchor: id // 添加anchor属性以兼容Sidebar中的点击处理
        });
      });
      
      // 更新目录数据
      tocItemsRef.value = newTocItems;
      
      // 发送目录数据到侧边栏
      if (article.value) {
        console.log('发送手动生成的目录数据到Sidebar:', newTocItems.length);
        emit('article-toc-updated', {
          tocItems: newTocItems,
          title: article.value.title || '文章',
          articleId: articleId.value
        });
      }
    } else {
      console.log('未找到标题元素，尝试从Markdown内容直接解析');
      
      // 如果没有找到标题元素，尝试从Markdown内容直接解析
      if (article.value?.content) {
        const contentLines = article.value.content.split('\n');
        const headingRegex = /^(#{1,4})\s+(.+)$/;
        const parsedTocItems: TocItem[] = [];
        
        contentLines.forEach((line, index) => {
          const match = line.match(headingRegex);
          if (match) {
            const level = match[1].length; // #的数量表示级别
            const text = match[2].trim();
            const id = `header-${index}`;
            
            parsedTocItems.push({
              level,
              text,
              id,
              anchor: id
            });
          }
        });
        
        if (parsedTocItems.length > 0) {
          tocItemsRef.value = parsedTocItems;
          hasToc.value = true;
          
          console.log('通过Markdown内容直接解析出目录项:', parsedTocItems.length);
          emit('article-toc-updated', {
            tocItems: parsedTocItems,
            title: article.value.title || '文章',
            articleId: articleId.value
          });
        } else {
          console.log('从Markdown内容也未能解析出标题');
        }
      }
    }
  });
};

// 监听滚动事件
const handleScroll = () => {
  calculateReadingProgress();
  
  // 如果预览组件存在，更新当前活动标题并发送更新
  if (previewRef.value?.previewRef?.updateTocHightlight) {
    previewRef.value.previewRef.updateTocHightlight();
    
    // 发送目录更新事件，包含当前活跃状态
    emit('article-toc-active-updated', {
      tocItems: tocItems.value
    });
  }
};

// 获取文章详情
const fetchArticleDetail = async (id: string) => {
  try {
    loading.value = true;
    // 注意：API参数中的id是字符串类型
    const res = await getArticleInfo({ id: id });
    console.log('文章详情响应:', res);
    
    if (res.data?.data) {
      article.value = res.data.data;
      console.log('文章内容获取成功');
      
      // 让渲染器有时间处理Markdown
      nextTick(() => {
        setTimeout(() => {
          if (previewRef.value) {
            console.log('预览组件已挂载，尝试获取目录');
            
            // 首先尝试使用预览组件自带的目录
            if (previewRef.value.previewRef?.tocItems && previewRef.value.previewRef.tocItems.length > 0) {
              console.log('预览组件自带目录项数量:', previewRef.value.previewRef.tocItems.length);
              hasToc.value = true;
              
              // 发送目录数据到Sidebar，非空断言确保article.value不为null
              if (article.value) {
                emit('article-toc-updated', {
                  tocItems: previewRef.value.previewRef.tocItems,
                  title: article.value.title || '文章',
                  articleId: id
                });
              }
              return;
            }
            
            // 否则手动查找标题元素
            const headers = previewRef.value.$el.querySelectorAll('h1, h2, h3, h4');
            
            if (headers.length > 0) {
              console.log('找到标题元素:', headers.length);
              // 创建新的目录数组
              const newTocItems: TocItem[] = [];
              
              // 生成目录
              headers.forEach((header: Element, index: number) => {
                const htmlHeader = header as HTMLElement;
                const level = parseInt(htmlHeader.tagName.substring(1));
                const text = htmlHeader.textContent || `标题 ${index + 1}`;
                const id = `header-${index}`;
                
                // 为标题添加ID以供跳转
                htmlHeader.id = id;
                
                newTocItems.push({
                  level,
                  text,
                  id,
                  anchor: id
                });
              });
              
              // 更新目录数据
              tocItemsRef.value = newTocItems;
              hasToc.value = newTocItems.length > 0;
              
              // 发送目录数据到侧边栏
              if (hasToc.value && article.value) {
                console.log('发送目录数据:', {
                  count: newTocItems.length,
                  title: article.value.title
                });
                emit('article-toc-updated', {
                  tocItems: newTocItems,
                  title: article.value.title || '文章',
                  articleId: id
                });
              }
            } else {
              console.log('未找到标题元素，尝试从Markdown内容直接解析');
              
              // 如果没有找到标题元素，尝试从Markdown内容直接解析
              if (article.value?.content) {
                const contentLines = article.value.content.split('\n');
                const headingRegex = /^(#{1,4})\s+(.+)$/;
                const parsedTocItems: TocItem[] = [];
                
                contentLines.forEach((line, index) => {
                  const match = line.match(headingRegex);
                  if (match) {
                    const level = match[1].length; // #的数量表示级别
                    const text = match[2].trim();
                    const id = `header-${index}`;
                    
                    parsedTocItems.push({
                      level,
                      text,
                      id,
                      anchor: id
                    });
                  }
                });
                
                if (parsedTocItems.length > 0) {
                  tocItemsRef.value = parsedTocItems;
                  hasToc.value = true;
                  
                  console.log('通过Markdown内容直接解析出目录项:', parsedTocItems.length);
                  emit('article-toc-updated', {
                    tocItems: parsedTocItems,
                    title: article.value.title || '文章',
                    articleId: id
                  });
                } else {
                  console.log('从Markdown内容也未能解析出标题');
                  hasToc.value = false;
                }
              }
            }
          } else {
            console.log('预览组件未挂载，无法获取目录');
          }
        }, 500); // 给渲染器一些时间来处理Markdown
      });
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
  if (id && typeof id === 'string') {
    articleId.value = id;
    fetchArticleDetail(id);
  } else {
    loading.value = false;
  }
  
  // 设置滚动元素为整个窗口
  scrollElement.value = document.documentElement;
  
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  
  // 初始计算进度
  calculateReadingProgress();
  
  // 立即通知Sidebar我们正在查看文章
  console.log('进入文章页面，发送事件');
  emit('enter-article-page', true);
  
  // 确保在组件挂载后的下一个周期再次检查和发送目录数据
  nextTick(() => {
    setTimeout(() => {
      if (previewRef.value && tocItems.value.length > 0) {
        console.log('延迟发送目录数据:', tocItems.value.length);
        emit('article-toc-updated', {
          tocItems: tocItems.value,
          title: article.value?.title || '文章',
          articleId: articleId.value
        });
      }
    }, 1000); // 延迟1秒再次尝试发送
  });
});

onUnmounted(() => {
  // 移除滚动事件监听
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
  
  // 通知侧边栏我们已离开文章页面
  console.log('离开文章页面，发送事件');
  emit('enter-article-page', false);
});
</script>

<style scoped>
.article-container {
  @apply relative space-y-8;
}

/* 阅读进度条样式 */
.reading-progress-container {
  @apply fixed top-0 left-0 w-full h-1 bg-gray-200 z-50;
}

.reading-progress-bar {
  @apply h-full bg-blue-600 transition-all duration-200;
}

/* 文章布局 */
.article-layout {
  @apply flex gap-8 max-w-6xl mx-auto;
}

.article-main {
  @apply flex-1;
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

.article-summary {
  @apply text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-6 py-2;
}

.no-content-tip {
  @apply text-gray-500 italic text-center py-4;
}

/* 目录侧边栏样式 */
.article-toc-container {
  @apply hidden lg:block w-64 shrink-0;
}

.article-toc {
  @apply sticky top-20 bg-white rounded-xl shadow-sm p-4 max-h-[calc(100vh-8rem)] overflow-y-auto;
}

.toc-title {
  @apply text-lg font-medium mb-4 pb-2 border-b border-gray-100;
}

.markdown-toc {
  @apply space-y-2;
}

.toc-item {
  @apply text-sm text-gray-600 cursor-pointer transition-colors truncate py-1 hover:text-blue-600;
}

.toc-active {
  @apply text-blue-600 font-medium;
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

/* 响应式布局 */
@media (max-width: 1023px) {
  .article-layout {
    @apply flex-col;
  }
  
  .article-toc-container {
    @apply w-full order-first;
  }
  
  .article-toc {
    @apply static p-4 mb-4 max-h-64;
  }
}
</style>