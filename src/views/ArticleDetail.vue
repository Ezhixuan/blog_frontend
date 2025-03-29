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
              <a href="javascript:void(0)" class="meta-category">{{ article.categoryName }}</a>
            </div>
            
            <!-- 文章标签 -->
            <div v-if="article.tagMap && Object.keys(article.tagMap).length > 0" class="article-tags">
              <div 
                v-for="(value, key) in article.tagMap" 
                :key="key"
                class="article-tag"
              >
                {{ value }}
              </div>
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
                class="article-markdown"
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
    </div>
    <!-- 回到顶部按钮 -->
    <BackToTop :visibility-height="300" :duration="500" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleInfo } from '../api/generated/api/articleController';
import { emit } from '@/utils/eventBus';
import BackToTop from '../components/BackToTop.vue';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import message from '@/utils/message';
import { useTheme } from '@/utils/theme';

// 获取当前主题
const { currentTheme } = useTheme();
const isDarkMode = computed(() => currentTheme.value === 'dark');

// 确保在组件内部也配置代码复制插件
VMdPreview.use(createCopyCodePlugin({
  beforeCopy: (text: string) => {
    console.log('[代码复制] 准备复制代码:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    return text;
  },
  afterCopy: (text: string) => {
    console.log('[代码复制] 复制成功，复制内容长度:', text.length);
    console.log('[代码复制] 复制操作时间:', new Date().toLocaleTimeString());
    message.success('复制成功');
  }
}));

// 全局监听剪贴板事件
const setupCopyListener = () => {
  document.addEventListener('copy', (event) => {
    // 获取选中的文本
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText.trim()) {
      console.log('[全局复制] 复制内容长度:', selectedText.length);
      console.log('[全局复制] 复制操作时间:', new Date().toLocaleTimeString());
      console.log('[全局复制] 复制内容预览:', selectedText.substring(0, 50) + (selectedText.length > 50 ? '...' : ''));
      
      // 显示复制成功提示
      message.success('复制成功');
    }
  });
};

// 定义目录项接口
interface TocItem {
  level: number;
  text: string;
  id: string;
  anchor: string;
  element?: HTMLElement; // 对应DOM元素的引用
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
const tocContainerRef = ref<HTMLElement | null>(null);
const scrollElement = ref<HTMLElement | null>(null);
const isScrolling = ref(false);
const activeHeadings = ref<Set<string>>(new Set());

// 存储目录项的响应式引用
const tocItemsRef = ref<TocItem[]>([]);

// 计算目录项数据，用于传递给侧边栏
const tocItems = computed(() => {
  if (previewRef.value?.previewRef?.tocItems) {
    console.log('[LOG_POINT_73] tocItems计算属性返回值长度:', previewRef.value.previewRef.tocItems.length);
    return previewRef.value.previewRef.tocItems;
  }
  console.log('[LOG_POINT_74] tocItems计算属性返回空数组');
  return [];
});

// 计算是否需要固定目录
const updateTocPosition = () => {
  // 对于跟随页面滚动的目录，不需要固定定位
  // 这里我们可以清除之前的固定定位相关样式
  if (tocContainerRef.value && tocRef.value) {
    const containerRect = tocContainerRef.value.getBoundingClientRect();
    
    console.log('[LOG_POINT_45] 目录容器位置:', {
      top: containerRect.top,
      left: containerRect.left,
      height: containerRect.height,
      scrollY: window.scrollY
    });
    
    // 确保不应用任何固定定位样式
    isScrolling.value = false;
    tocRef.value.style.width = '';
    tocRef.value.style.maxHeight = '';
    tocRef.value.style.left = '';
    
    console.log('[LOG_POINT_47] 目录将跟随页面滚动');
  } else {
    console.warn('[LOG_POINT_48] 目录容器或目录元素引用不存在:', {
      tocContainerExists: !!tocContainerRef.value,
      tocElementExists: !!tocRef.value
    });
  }
};

// 判断指定目录项是否在当前屏幕可见区域或应该激活
const isItemOnScreen = (item: any, index: number) => {
  if (!item) return false;
  
  // 如果目录项已激活，返回true
  if (item.active) {
    return true;
  }
  
  // 当前阅读进度百分比
  const currentProgress = readingProgress.value;
  
  // 检查previewRef是否存在及其tocItems
  if (!previewRef.value?.previewRef?.tocItems) return false;
  
  // 基于目录结构计算每个目录项的阅读位置百分比
  const totalItems = previewRef.value.previewRef.tocItems.length || 1;
  
  // 计算该目录项对应的位置百分比，考虑层级结构
  let weightedIndex = index;
  // 对于低级别的标题，增加其权重，使其更接近高级别标题的进度
  if (item.level && item.level > 1) {
    // 减少低级别标题的权重影响
    weightedIndex = index * (1 - (item.level - 1) * 0.1);
  }
  
  const estimatedProgress = ((weightedIndex + 1) / totalItems) * 100;
  
  // 使用更精确的进度比较逻辑
  // 1. 如果当前阅读进度超过了估算进度的阈值，认为该项应该高亮
  // 2. 为每个目录项创建一个"高亮窗口"，当前进度在窗口内时高亮
  const progressWindow = 100 / totalItems; // 每个目录项对应的进度窗口大小
  const itemStartProgress = (weightedIndex / totalItems) * 100;
  const itemEndProgress = ((weightedIndex + 1) / totalItems) * 100;
  
  // 进度窗口检查 - 当前进度落在该项的窗口内
  if (currentProgress >= itemStartProgress && currentProgress < itemEndProgress) {
    return true;
  }
  
  // 考虑进度阈值 - 如果已经阅读了超过该项进度的85%
  if (currentProgress >= estimatedProgress * 0.85) {
    return true;
  }
  
  // 如果已经确认该项在屏幕上可见，返回true
  if (activeHeadings.value.has(item.anchor)) {
    return true;
  }
  
  // 如果previewRef或tocItems不存在，直接返回false
  if (!previewRef.value?.previewRef?.tocItems) return false;
  
  // 如果上一项是激活状态，当前项在下一个激活项之前，也显示进度
  if (index > 0 && (
    previewRef.value.previewRef.tocItems[index - 1]?.active || 
    isItemOnScreen(previewRef.value.previewRef.tocItems[index - 1], index - 1)
  )) {
    // 查找下一个激活项
    let nextActiveIndex = -1;
    for (let i = index + 1; i < totalItems; i++) {
      // 检查索引是否有效且tocItems存在
      if (i < previewRef.value.previewRef.tocItems.length) {
        if (previewRef.value.previewRef.tocItems[i]?.active || 
            isItemOnScreen(previewRef.value.previewRef.tocItems[i], i)) {
          nextActiveIndex = i;
          break;
        }
      }
    }
    
    // 如果没有下一个激活项，或者当前进度小于下一个激活项的进度，则当前项也应高亮
    if (nextActiveIndex === -1 || currentProgress < ((nextActiveIndex / totalItems) * 100)) {
      return true;
    }
  }
  
  return false;
};

// 更新屏幕上可见的标题并设置当前激活的目录项
const updateVisibleHeadings = () => {
  // 查找所有标题元素
  const headings = document.querySelectorAll('h1, h2, h3, h4');
  if (!headings.length) return;

  // 检查预览组件及目录是否存在
  if (!previewRef.value?.previewRef?.tocItems) {
    console.warn('无法更新目录高亮: 目录数据不存在');
    return;
  }

  // 记录可见的标题ID
  const visibleHeadings = new Set<string>();
  
  // 找到当前视窗中最靠上的可见标题，它将成为激活标题
  let activeHeadingId: string | null = null;
  let minDistance = Infinity;
  
  // 检查每个标题的位置
  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    // 标题在视口范围内（已经进入视口，但还没有完全滚出视口上方）
    const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;
    
    if (isVisible && heading.id) {
      visibleHeadings.add(heading.id);
      
      // 计算标题顶部到视口顶部的距离，优先选择最接近视口顶部但已经进入视口的标题
      // 使用较小的偏移量，让标题更早被识别为激活状态
      const offset = 80; // 80px的偏移量，比原来的100px更小
      const distance = Math.abs(rect.top - offset);
      
      // 找到视口中位置最优的标题
      if (rect.top >= -50 && distance < minDistance) { // 允许标题略微超出顶部
        minDistance = distance;
        activeHeadingId = heading.id;
      }
    }
  });
  
  // 如果没有找到在视口内的标题，尝试找到第一个在视口上方的标题
  if (!activeHeadingId) {
    minDistance = Infinity;
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      // 标题在视口上方
      if (rect.bottom <= 0 && heading.id) {
        const distance = Math.abs(rect.bottom);
        if (distance < minDistance) {
          minDistance = distance;
          activeHeadingId = heading.id;
        }
      }
    });
  }
  
  activeHeadings.value = visibleHeadings;
  
  // 在目录中更新激活状态
  if (activeHeadingId && previewRef.value?.previewRef?.tocItems) {
    updateActiveTocItem(activeHeadingId);
  }
};

// 在目录中更新激活项
const updateActiveTocItem = (activeId: string) => {
  if (!previewRef.value?.previewRef?.tocItems) {
    console.warn('更新目录项失败: 目录数据不存在');
    return;
  }
  
  console.log('开始更新目录项激活状态, 当前激活ID:', activeId);
  
  const tocItems = previewRef.value.previewRef.tocItems;
  console.log('目录项数量:', tocItems.length);
  
  // 移除所有项的激活状态
  tocItems.forEach((item: any) => {
    item.active = false;
  });
  
  // 设置匹配的项为激活状态
  let activeIndex = -1;
  for (let i = 0; i < tocItems.length; i++) {
    if (tocItems[i].anchor === activeId) {
      tocItems[i].active = true;
      activeIndex = i;
      console.log('找到激活目录项:', i, tocItems[i].text);
      break;
    }
  }
  
  if (activeIndex === -1) {
    console.warn('未找到匹配的目录项, ID:', activeId);
  }
  
  // 如果有激活的目录项，考虑设置其前后项的状态
  if (activeIndex >= 0) {
    const totalItems = tocItems.length;
    const currentProgress = readingProgress.value;
    
    console.log('当前阅读进度:', currentProgress, '%');
    
    // 计算进度窗口
    const progressPerItem = 100 / totalItems;
    
    // 根据阅读进度，设置已读项和部分已读项
    for (let i = 0; i < tocItems.length; i++) {
      // 为目录项添加自定义状态
      if (!tocItems[i].custom) tocItems[i].custom = {};
      
      // 已读状态 - 在激活项之前的都标记为已读
      if (i < activeIndex) {
        tocItems[i].custom.readStatus = 'read';
      }
      // 正在读状态 - 激活项本身
      else if (i === activeIndex) {
        tocItems[i].custom.readStatus = 'reading';
      }
      // 部分读状态 - 如果进度已经超过了该项开始位置
      else if (currentProgress >= ((i / totalItems) * 100) * 0.9) {
        tocItems[i].custom.readStatus = 'partial';
      }
      // 未读状态 - 其余项
      else {
        tocItems[i].custom.readStatus = 'unread';
      }
    }
    
    // 检查数据属性是否正确设置
    setTimeout(() => {
      const tocElements = document.querySelectorAll('.toc-item');
      console.log('目录DOM元素数量:', tocElements.length);
      if (tocElements.length > 0) {
        console.log('第一个目录元素data-read-status:', tocElements[0].getAttribute('data-read-status'));
        if (activeIndex < tocElements.length) {
          console.log('激活目录元素data-read-status:', tocElements[activeIndex].getAttribute('data-read-status'));
        }
      }
    }, 0);
  }
  
  // 确保激活项在目录可视区域内
  setTimeout(() => {
    scrollActiveTocItemIntoView();
  }, 10);
};

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
  
  // 添加调试输出
  if (readingProgress.value % 10 < 0.5) {  // 每10%输出一次日志，避免过多日志
    console.log('阅读进度更新:', Math.round(readingProgress.value), '%');
  }
};

// 修改并增强onContentRendered方法
const onContentRendered = () => {
  console.log('[LOG_POINT_20] 文章内容渲染完成，准备处理目录');
  
  // 使用setTimeout确保DOM完全渲染
  setTimeout(() => {
    // 初始化标志和数据
    let hasTocData = false;
    let tocData: any[] = [];
    
    // 首先检查预览组件是否已经生成了目录
    if (previewRef.value?.previewRef?.tocItems && previewRef.value.previewRef.tocItems.length > 0) {
      console.log('[LOG_POINT_21] 使用预览组件内置的目录数据:', previewRef.value.previewRef.tocItems.length);
      
      // 打印完整数据结构，帮助调试
      console.log('[数据调试] 完整目录数据结构:', JSON.stringify(previewRef.value.previewRef.tocItems.slice(0, 2)));
      
      // 记录目录项数据结构
      const sampleItem = previewRef.value.previewRef.tocItems[0];
      console.log('[LOG_POINT_22] 目录项数据结构样例:', JSON.stringify(sampleItem));
      
      hasToc.value = true;
      hasTocData = true;
      tocData = previewRef.value.previewRef.tocItems;
      
      // 为每个目录项添加自定义状态对象并检查已有状态
      tocData.forEach((item, idx) => {
        console.log(`[数据调试] 项 ${idx} 初始状态:`, {
          text: item.text,
          level: item.level,
          hasCustomObj: !!item.custom,
          readStatus: item.custom?.readStatus,
          active: item.active
        });
        
        if (!item.custom) item.custom = { readStatus: 'unread' };
        console.log(`[LOG_POINT_23] 初始化目录项 ${idx}: ${item.text}, 级别: ${item.level}`);
      });
    } else {
      console.log('[LOG_POINT_24] 预览组件未提供目录数据，尝试手动生成');
      
      // 尝试各种方式查找标题元素
      let headers = document.querySelectorAll('.v-md-pre-wrapper h1, .v-md-pre-wrapper h2, .v-md-pre-wrapper h3, .v-md-pre-wrapper h4');
      
      if (headers.length === 0) {
        console.log('[LOG_POINT_25] 未找到预览包装器中的标题，尝试markdown-body选择器');
        headers = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4');
      }
      
      if (headers.length === 0) {
        console.log('[LOG_POINT_26] 尝试全局查找标题元素');
        headers = document.querySelectorAll('h1, h2, h3, h4');
      }
      
      console.log('[LOG_POINT_27] 找到的标题元素数量:', headers.length);
      
      // 记录一下DOM结构，以便了解页面结构
      console.log('[LOG_POINT_28] 文章容器结构:', document.querySelector('.article-content')?.innerHTML.substring(0, 200) + '...');
      
      hasToc.value = headers.length > 0;
      
      // 如果找到标题元素，生成目录
      if (hasToc.value) {
        console.log('[LOG_POINT_29] 从标题元素生成目录');
        // 生成目录
        headers.forEach((header: Element, index: number) => {
          const htmlHeader = header as HTMLElement;
          const level = parseInt(htmlHeader.tagName.substring(1));
          const text = htmlHeader.textContent || `标题 ${index + 1}`;
          const id = `header-${index}`;
          
          console.log(`[LOG_POINT_30] 处理标题 ${index}: ${text}, 级别: ${level}`);
          
          // 为标题添加ID以供跳转
          htmlHeader.id = id;
          
          tocData.push({
            level,
            text,
            id,
            anchor: id,
            custom: { readStatus: 'unread' }
          });
        });
        
        hasTocData = true;
      } else if (article.value?.content) {
        // 如果没有找到标题元素，从Markdown内容直接解析
        console.log('[LOG_POINT_31] 未找到标题元素，尝试从Markdown内容直接解析');
        const contentLines = article.value.content.split('\n');
        const headingRegex = /^(#{1,4})\s+(.+)$/;
        
        console.log('[LOG_POINT_32] 共有内容行数:', contentLines.length);
        console.log('[LOG_POINT_33] 内容前50个字符:', article.value.content.substring(0, 50));
        
        contentLines.forEach((line, index) => {
          const match = line.match(headingRegex);
          if (match) {
            const level = match[1].length; // #的数量表示级别
            const text = match[2].trim();
            const id = `header-${index}`;
            
            console.log(`[LOG_POINT_34] 从Markdown解析到标题 ${index}: ${text}, 级别: ${level}`);
            
            tocData.push({
              level,
              text,
              id,
              anchor: id,
              custom: { readStatus: 'unread' }
            });
          }
        });
        
        if (tocData.length > 0) {
          console.log('[LOG_POINT_35] 通过Markdown内容直接解析出目录项:', tocData.length);
          hasToc.value = true;
          hasTocData = true;
        } else {
          console.log('[LOG_POINT_36] 从Markdown内容也未能解析出标题');
        }
      }
    }
    
    // 更新目录数据到组件
    if (hasTocData && tocData.length > 0) {
      console.log('[LOG_POINT_37] 目录数据已生成，准备更新到组件');
      
      // 直接设置到预览组件中，如果预览组件不存在tocItems则创建
      if (previewRef.value && previewRef.value.previewRef) {
        if (!previewRef.value.previewRef.tocItems) {
          console.log('[LOG_POINT_38] 为预览组件创建新的tocItems');
          previewRef.value.previewRef.tocItems = tocData;
        } else {
          console.log('[LOG_POINT_39] 预览组件已有tocItems，数量:', previewRef.value.previewRef.tocItems.length);
        }
      } else {
        console.warn('[LOG_POINT_40] 预览组件引用不存在，无法更新目录数据');
      }
      
      // 更新组件内的目录数据引用
      tocItemsRef.value = tocData;
      
      // 立即触发一次阅读进度更新
      calculateReadingProgress();
      updateTocItemsByProgress();
      
      // 验证目录数据DOM同步
      nextTick(() => {
        const tocItems = document.querySelectorAll('.toc-item');
        console.log('[LOG_POINT_41] DOM中的目录项数量:', tocItems.length, '数据中的目录项数量:', tocData.length);
        
        // 检查悬浮目录
        const floatingItems = document.querySelectorAll('.floating-toc .toc-item');
        console.log('[数据调试] 悬浮目录DOM项数量:', floatingItems.length);
        
        // 检查DOM中的数据属性
        if (tocItems.length > 0) {
          console.log('[LOG_POINT_42] 第一个目录项DOM属性:', {
            readStatus: tocItems[0].getAttribute('data-read-status'),
            index: tocItems[0].getAttribute('data-item-index'),
            text: tocItems[0].getAttribute('data-item-text')
          });
        }
      });
      
      // 发送目录数据到侧边栏
      if (article.value) {
        console.log('[LOG_POINT_43] 发送目录数据到Sidebar，项目数:', tocData.length);
        nextTick(() => {
          emit('article-toc-updated', {
            tocItems: tocData,
            title: article.value?.title || '文章',
            articleId: articleId.value
          });
          
          // 初始化悬浮目录
          console.log('[LOG_POINT_65] 初始化悬浮目录');
          updateFloatingToc();
        });
      }
    } else {
      console.warn('[LOG_POINT_44] 无法生成目录数据');
      hasToc.value = false;
    }
  }, 500); // 给予足够时间让DOM渲染完成
};

// 处理滚动事件，确保目录随阅读进度更新
const handleScroll = () => {
  // 计算当前阅读进度
  calculateReadingProgress();
  
  // 更新目录固定位置
  updateTocPosition();
  
  // 确保相关数据存在再进行更新
  if (!previewRef.value?.previewRef) return;
  
  // 更新屏幕上可见的标题
  updateVisibleHeadings();
  
  // 更新目录项状态
  if (previewRef.value.previewRef.tocItems) {
    // 根据阅读进度更新目录状态
    updateTocItemsByProgress();
    
    // 确保活跃的目录项在目录可视区域内
    // 每次滚动都更新，保证目录项始终居中
    scrollActiveTocItemIntoView();
    
    // 同步更新悬浮目录
    updateFloatingToc();
    
    // 如果预览组件有自带的目录高亮方法，也调用它
    if (previewRef.value.previewRef.updateTocHightlight) {
      try {
        previewRef.value.previewRef.updateTocHightlight();
      } catch (error) {
        console.error('更新目录高亮失败:', error);
      }
    }
    
    // 发送目录更新事件，包含当前活跃状态
    if (tocItems.value.length > 0) {
      emit('article-toc-active-updated', {
        tocItems: tocItems.value
      });
    }
  }
  
  // 防抖处理，避免过于频繁更新
  if (scrollThrottleTimeout.value) {
    clearTimeout(scrollThrottleTimeout.value);
  }
  
  scrollThrottleTimeout.value = setTimeout(() => {
    scrollThrottleTimeout.value = null;
    // 确保滚动停止后也进行一次更新
    scrollActiveTocItemIntoView();
  }, 100);
};

// 在script开头定义防抖计时器，使用正确的类型
const scrollThrottleTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

// 根据阅读进度直接更新目录项状态
const updateTocItemsByProgress = () => {
  if (!previewRef.value?.previewRef?.tocItems) {
    console.warn('[LOG_POINT_10] 更新目录状态失败: 目录数据不存在');
    return;
  }
  
  const tocItems = previewRef.value.previewRef.tocItems;
  const totalItems = tocItems.length;
  if (totalItems === 0) {
    console.warn('[LOG_POINT_11] 目录项数量为0，无法更新');
    return;
  }
  
  console.log('[LOG_POINT_12] 开始更新目录状态，总项数:', totalItems);
  
  const currentProgress = readingProgress.value;
  
  // 计算当前应处于活跃状态的目录项
  let activeIndex = Math.floor((currentProgress / 100) * totalItems);
  activeIndex = Math.min(activeIndex, totalItems - 1);
  
  // 确保activeIndex是有效值
  if (activeIndex < 0) activeIndex = 0;
  
  // 避免频繁打印日志，只在进度变化较大时打印
  if (Math.abs(lastLoggedProgress - currentProgress) > 5) {
    console.log('[LOG_POINT_13] 根据进度计算的活跃索引:', activeIndex, '进度:', currentProgress.toFixed(1) + '%');
    lastLoggedProgress = currentProgress;
  }
  
  // 更新目录项状态
  for (let i = 0; i < totalItems; i++) {
    // 跳过无效目录项
    if (!tocItems[i]) {
      console.warn(`[LOG_POINT_14] 索引 ${i} 处的目录项无效`);
      continue;
    }
    
    // 确保有自定义状态对象
    if (!tocItems[i].custom) tocItems[i].custom = {};
    
    // 划分阅读状态区域
    const itemProgress = (i / totalItems) * 100;
    const nextItemProgress = ((i + 1) / totalItems) * 100;
    
    // 设置目录项的阅读状态
    const prevStatus = tocItems[i].custom.readStatus;
    
    if (currentProgress >= nextItemProgress) {
      // 已完全阅读的项
      tocItems[i].custom.readStatus = 'read';
    } else if (currentProgress >= itemProgress) {
      // 正在阅读的项
      tocItems[i].custom.readStatus = 'reading';
      // 设置此项为活跃项
      activeIndex = i;
    } else if (currentProgress >= itemProgress * 0.8) {
      // 即将阅读的项
      tocItems[i].custom.readStatus = 'partial';
    } else {
      // 未阅读的项
      tocItems[i].custom.readStatus = 'unread';
    }
    
    // 记录状态变化
    if (prevStatus !== tocItems[i].custom.readStatus) {
      console.log(`[LOG_POINT_15] 目录项 ${i} "${tocItems[i].text}" 状态从 ${prevStatus} 变为 ${tocItems[i].custom.readStatus}`);
    }
  }
  
  // 检查是否需要更新活跃项
  let activeItemChanged = false;
  let oldActiveIndex = -1;
  let newActiveIndex = -1;
  
  tocItems.forEach((item: any, i: number) => {
    const wasActive = item?.active === true;
    const willBeActive = (i === activeIndex);
    
    if (wasActive) oldActiveIndex = i;
    if (willBeActive) newActiveIndex = i;
    
    if (wasActive !== willBeActive) {
      activeItemChanged = true;
      if (item) {
        item.active = willBeActive;
        console.log(`[LOG_POINT_16] 目录项 ${i} "${item.text}" 活跃状态变为 ${willBeActive}`);
      }
    }
  });
  
  console.log(`[LOG_POINT_17] 活跃项变化: ${activeItemChanged}, 旧索引: ${oldActiveIndex}, 新索引: ${newActiveIndex}`);
  
  // 如果活跃项发生变化，立即更新滚动位置
  if (activeItemChanged) {
    console.log('[LOG_POINT_18] 活跃项已变化，将在下一帧更新滚动位置');
    nextTick(() => {
      console.log('[LOG_POINT_19] 开始执行滚动');
      scrollActiveTocItemIntoView();
    });
  }
};

// 在script开头添加上次记录的进度值
let lastLoggedProgress = 0;

// 将当前活跃的目录项滚动到可视区域中间
const scrollActiveTocItemIntoView = () => {
  if (!tocRef.value) {
    console.warn('[LOG_POINT_1] 滚动目录项失败: tocRef不存在');
    return;
  }
  
  try {
    // 查找当前活跃的目录项
    const activeItem = tocRef.value.querySelector('.toc-active');
    if (!activeItem) {
      console.debug('[LOG_POINT_2] 当前没有活跃的目录项');
      return;
    }
    
    console.log('[LOG_POINT_3] 找到活跃目录项:', (activeItem as HTMLElement).textContent);
    
    // 获取目录容器的可视区域
    const tocContainer = tocRef.value.querySelector('.markdown-toc');
    if (!tocContainer) {
      console.warn('[LOG_POINT_4] 滚动目录项失败: 目录容器不存在');
      return;
    }
    
    const containerRect = tocContainer.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    
    console.log('[LOG_POINT_5] 容器尺寸:', {
      width: containerRect.width,
      height: containerRect.height,
      top: containerRect.top,
      bottom: containerRect.bottom
    });
    
    console.log('[LOG_POINT_6] 目录项尺寸:', {
      width: itemRect.width,
      height: itemRect.height,
      top: itemRect.top,
      bottom: itemRect.bottom
    });
    
    // 计算居中位置所需的滚动距离
    const containerCenter = containerRect.height / 2;
    const itemCenter = itemRect.height / 2;
    
    // 计算目标项的中心点与容器中心点之间的距离
    const scrollTop = (activeItem as HTMLElement).offsetTop - containerCenter + itemCenter;
    
    console.log('[LOG_POINT_7] 滚动计算:', {
      containerCenter,
      itemCenter,
      offsetTop: (activeItem as HTMLElement).offsetTop,
      scrollTop
    });
    
    // 平滑滚动到目标位置
    tocContainer.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    });
    
    console.log('[LOG_POINT_8] 执行滚动到位置:', Math.max(0, scrollTop));
  } catch (error) {
    console.error('[LOG_POINT_9] 滚动目录项到可视区域失败:', error);
  }
};

// 在fetchArticleDetail方法中调用递归初始化函数
const fetchArticleDetail = async (id: string) => {
  try {
    loading.value = true;
    // 注意：API参数中的id是字符串类型
    const res = await getArticleInfo({ id: id });
    console.log('文章详情响应:', res);
    
    if (res.data?.data) {
      article.value = res.data.data;
      console.log('文章内容获取成功');
      
      // 设置一个标志，跟踪是否成功初始化了目录
      let tocInitialized = false;
      
      // 第一次尝试：立即检查目录
      nextTick(() => {
        if (previewRef.value?.previewRef?.tocItems?.length) {
          tocInitialized = true;
          console.log('立即获取目录成功');
          onContentRendered();
        }
      });
      
      // 第二次尝试：给渲染器一些时间
      setTimeout(() => {
        if (!tocInitialized && previewRef.value) {
          console.log('延迟300ms尝试获取目录');
          onContentRendered();
          tocInitialized = true;
        }
      }, 300);
      
      // 第三次尝试：更长的延迟
      setTimeout(() => {
        if (!tocInitialized) {
          console.log('延迟800ms尝试获取目录');
          onContentRendered();
          
          // 如果所有直接尝试都失败了，启动递归尝试机制
          setTimeout(() => {
            if (!previewRef.value?.previewRef?.tocItems || previewRef.value.previewRef.tocItems.length === 0) {
              console.log('常规方法未能初始化目录，启动递归尝试');
              // 重置尝试计数
              initializationAttempts = 0;
              tryInitializeToc();
            }
          }, 1000);
        }
      }, 800);
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

// 在script开头添加
declare global {
  interface Window {
    VueMarkdownPreview?: any;
  }
}

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
  
  // 定义自定义的目录项组件
  defineCustomTocItem();
  
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  
  // 初始计算进度
  calculateReadingProgress();
  
  // 设置全局复制事件监听
  setupCopyListener();
  
  // 发送进入文章页面事件
  emit('enter-article-page', true);
  
  // 在onMounted中恢复并增强目录检查逻辑
  nextTick(() => {
    // 检查预览组件是否已挂载并有TocItems
    console.log('[LOG_POINT_49] 组件挂载后检查目录状态');
    
    // 分析DOM结构，帮助找出问题
    const tocContainer = document.querySelector('.article-toc-container');
    const toc = document.querySelector('.article-toc');
    const tocItems = document.querySelectorAll('.toc-item');
    
    console.log('[LOG_POINT_50] DOM元素状态:', {
      tocContainerExists: !!tocContainer,
      tocExists: !!toc,
      tocItemsCount: tocItems.length,
      hasTocValue: hasToc.value,
      hasPreviewRef: !!previewRef.value,
      hasPreviewRefTocItems: !!previewRef.value?.previewRef?.tocItems,
      tocItemsInData: previewRef.value?.previewRef?.tocItems?.length || 0
    });
    
    // 检查CSS样式是否已应用
    if (toc) {
      const tocComputedStyle = window.getComputedStyle(toc);
      console.log('[LOG_POINT_51] 目录元素CSS计算样式:', {
        position: tocComputedStyle.position,
        top: tocComputedStyle.top,
        maxHeight: tocComputedStyle.maxHeight,
        overflow: tocComputedStyle.overflow,
        display: tocComputedStyle.display,
        flexDirection: tocComputedStyle.flexDirection
      });
    }
    
    // 延迟1秒检查目录状态
    setTimeout(() => {
      console.log('[LOG_POINT_52] 延迟1秒后再次检查目录状态');
      
      if (previewRef.value?.previewRef?.tocItems) {
        console.log('[LOG_POINT_53] 延迟1秒后发现目录项数量:', previewRef.value.previewRef.tocItems.length);
        
        if (previewRef.value.previewRef.tocItems.length > 0) {
          console.log('[LOG_POINT_54] 预览组件自带目录已加载, 直接更新');
          // 为目录项添加初始状态标记
          previewRef.value.previewRef.tocItems.forEach((item: any) => {
            if (!item.custom) item.custom = { readStatus: 'unread' };
          });
          
          // 立即更新目录项状态
          hasToc.value = true;
          updateTocItemsByProgress();
          
          // 发送目录数据到侧边栏
          if (article.value) {
            console.log('[LOG_POINT_55] 主动发送目录数据到侧边栏');
            emit('article-toc-updated', {
              tocItems: previewRef.value.previewRef.tocItems,
              title: article.value.title || '文章',
              articleId: articleId.value
            });
          }
        } else {
          console.log('[LOG_POINT_56] 预览组件目录项为空，尝试重新生成');
          // 尝试重新生成目录
          onContentRendered();
        }
      } else {
        console.log('[LOG_POINT_57] 延迟1秒后未发现目录数据，主动生成');
        onContentRendered();
      }
    }, 1000);
  });
  
  // 添加进度样式
  addProgressStyles();
  
  // 添加悬浮目录初始化
  nextTick(() => {
    // 已有的目录检查代码...
    
    // 添加悬浮目录检查
    setTimeout(() => {
      const floatingTocEl = document.querySelector('.floating-toc-container');
      console.log('[LOG_POINT_70] 悬浮目录容器存在:', !!floatingTocEl);
      
      if (hasToc.value && tocItems.value.length > 0) {
        console.log('[LOG_POINT_71] 悬浮目录应显示，数据项数:', tocItems.value.length);
        updateFloatingToc();
      } else {
        console.log('[LOG_POINT_72] 悬浮目录不应显示，hasToc:', hasToc.value, 'tocItems长度:', tocItems.value.length);
      }
    }, 1500);
  });
});

// 递归尝试初始化目录
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 5;

const tryInitializeToc = () => {
  if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
    console.warn(`已尝试${MAX_INITIALIZATION_ATTEMPTS}次初始化目录，放弃尝试`);
    return;
  }
  
  initializationAttempts++;
  console.log(`第${initializationAttempts}次尝试初始化目录`);
  
  // 检查目录是否已经存在
  if (previewRef.value?.previewRef?.tocItems && previewRef.value.previewRef.tocItems.length > 0) {
    console.log('目录已存在，更新状态');
    hasToc.value = true;
    updateTocItemsByProgress();
    return;
  }
  
  // 尝试生成目录
  onContentRendered();
  
  // 如果还是没有目录，延迟后重试
  setTimeout(() => {
    if (!previewRef.value?.previewRef?.tocItems || previewRef.value.previewRef.tocItems.length === 0) {
      tryInitializeToc();
    }
  }, 500);
};

// 处理窗口大小变化
const handleResize = () => {
  updateVisibleHeadings();
  calculateReadingProgress();
  updateTocPosition();
};

onUnmounted(() => {
  // 移除滚动事件监听
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  
  // 移除全局复制事件监听
  document.removeEventListener('copy', (event) => {});
  
  // 通知侧边栏我们已离开文章页面
  console.log('离开文章页面，发送事件');
  emit('enter-article-page', false);
  
  // 清理添加的样式
  const styleElement = document.getElementById('article-toc-progress-styles');
  if (styleElement) {
    document.head.removeChild(styleElement);
  }
});

// 确保在toc组件定义中添加proper类名绑定
const defineCustomTocItem = () => {
  if (window.VueMarkdownPreview) {
    // 自定义目录项组件
    window.VueMarkdownPreview.defineCustomTocItem({
      template: `
        <li :class="['toc-item', item.active ? 'toc-active' : '']">
          <a :href="'#' + item.anchor" @click.prevent="handleClick">{{ item.text }}</a>
        </li>
      `,
      props: {
        item: {
          type: Object,
          required: true
        }
      },
      setup(props: any) {
        const handleClick = () => {
          const el = document.getElementById(props.item.anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            
            // 更新当前激活的目录项
            if (props.item.parent && props.item.parent.tocItems) {
              props.item.parent.tocItems.forEach((item: any) => {
                item.active = item === props.item;
              });
            }
          }
        };
        
        return {
          handleClick
        };
      }
    });
  }
};

// 发送目录数据到侧边栏
const sendTocDataToSidebar = () => {
  if (article.value && previewRef.value?.previewRef?.tocItems) {
    const tocItems = previewRef.value.previewRef.tocItems.map((item: any) => ({
      level: item.level,
      text: item.text,
      id: item.id,
      anchor: item.anchor,
      element: document.getElementById(item.anchor) || undefined
    }));
    
    emit('article-toc-updated', {
      tocItems,
      title: article.value.title || '文章',
      articleId: articleId.value
    });
    
    hasToc.value = tocItems.length > 0;
  }
};

// 添加更精确的CSS样式来显示阅读进度
const addProgressStyles = () => {
  // 删除旧样式以防重复
  const oldStyle = document.getElementById('article-toc-progress-styles');
  if (oldStyle) {
    document.head.removeChild(oldStyle);
  }

  // 创建样式元素
  const styleElement = document.createElement('style');
  styleElement.id = 'article-toc-progress-styles';
  
  // 定义样式内容
  styleElement.textContent = `
    /* 目录指示器基础样式 */
    .toc-item-indicator {
      position: absolute !important;
      left: -15px !important;
      top: 0 !important;
      height: 100% !important;
      width: 3px !important;
      background-color: transparent !important;
      transition: all 0.3s ease !important;
    }
    
    .toc-item-indicator.active {
      background-color: #1890ff !important;
    }
    
    /* 已读状态 */
    .article-toc .toc-item[data-read-status="read"] {
      color: #333 !important;
    }
    
    .article-toc .toc-item[data-read-status="read"] .toc-item-indicator {
      background-color: #1890ff !important;
      opacity: 0.7 !important;
    }
    
    /* 阅读中状态 */
    .article-toc .toc-item[data-read-status="reading"] {
      color: #1890ff !important;
      font-weight: 600 !important;
    }
    
    .article-toc .toc-item[data-read-status="reading"] .toc-item-indicator {
      background-color: #1890ff !important;
      opacity: 1 !important;
      box-shadow: 0 0 3px rgba(24, 144, 255, 0.5) !important;
    }
    
    /* 部分阅读状态 */
    .article-toc .toc-item[data-read-status="partial"] {
      color: #666 !important;
    }
    
    .article-toc .toc-item[data-read-status="partial"] .toc-item-indicator {
      background-color: #1890ff !important;
      opacity: 0.4 !important;
    }
    
    /* 未读状态 */
    .article-toc .toc-item[data-read-status="unread"] {
      color: #999 !important;
    }
    
    .article-toc .toc-item[data-read-status="unread"] .toc-item-indicator {
      background-color: transparent !important;
    }
    
    /* 活跃项样式 */
    .article-toc .toc-item.toc-active::before {
      background-color: #1890ff !important;
    }
    
    .article-toc .toc-item.toc-active {
      color: #1890ff !important;
      font-weight: 600 !important;
    }
  `;
  
  // 添加到文档中
  document.head.appendChild(styleElement);
  console.log('已添加阅读进度样式');
};

// 根据目录项状态获取指示器颜色
const getIndicatorColor = (item: any, index: number) => {
  if (!item) return 'transparent';
  
  if (item.active || item.custom?.readStatus === 'reading') {
    return '#1890ff';
  }
  
  if (item.custom?.readStatus === 'read' || item.custom?.readStatus === 'partial') {
    return '#1890ff';
  }
  
  if (isItemOnScreen(item, index)) {
    return '#1890ff';
  }
  
  return 'transparent';
};

// 根据目录项状态获取指示器不透明度
const getIndicatorOpacity = (item: any, index: number) => {
  if (!item) return '0';
  
  if (item.active || item.custom?.readStatus === 'reading') {
    return '1';
  }
  
  if (item.custom?.readStatus === 'read') {
    return '0.7';
  }
  
  if (item.custom?.readStatus === 'partial') {
    return '0.4';
  }
  
  if (isItemOnScreen(item, index)) {
    return '0.5';
  }
  
  return '0';
};

// 根据目录项状态获取文本颜色
const getTextColor = (item: any, index: number) => {
  if (!item) return '#999';
  
  if (item.active || item.custom?.readStatus === 'reading') {
    return '#1890ff';
  }
  
  if (item.custom?.readStatus === 'read') {
    return '#333';
  }
  
  if (item.custom?.readStatus === 'partial') {
    return '#666';
  }
  
  return '#999';
};

// 添加悬浮目录引用
const floatingTocRef = ref<HTMLElement | null>(null);

// 新增更新悬浮目录的方法，增强数据传递
const updateFloatingToc = () => {
  if (!floatingTocRef.value) {
    console.log('[悬浮目录] DOM元素不存在');
    return;
  }
  
  // 放宽条件检查，允许使用计算属性中的数据
  console.log('[悬浮目录] 更新悬浮目录，目录项数量:', tocItems.value.length);
  
  // 这里确保悬浮目录和主目录使用相同的数据源
  nextTick(() => {
    // 确保引用依然存在
    if (!floatingTocRef.value) return;
    
    // 检查DOM是否正确渲染
    const floatingTocItems = floatingTocRef.value.querySelectorAll('.toc-item');
    console.log('[悬浮目录] DOM项数量:', floatingTocItems.length, '数据项数量:', tocItems.value.length);
    
    // 调整视口高度
    const viewportHeight = window.innerHeight;
    floatingTocRef.value.style.maxHeight = `${viewportHeight - 60}px`;
    
    // 确保活跃项在悬浮目录中可见
    const activeItem = floatingTocRef.value.querySelector('.toc-active');
    if (activeItem) {
      const container = floatingTocRef.value.querySelector('.markdown-toc');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        
        // 计算滚动位置，使活跃项居中
        const containerCenter = containerRect.height / 2;
        const itemCenter = itemRect.height / 2;
        const scrollTop = (activeItem as HTMLElement).offsetTop - containerCenter + itemCenter;
        
        // 平滑滚动
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
        
        console.log('[悬浮目录] 滚动到活跃项:', (activeItem as HTMLElement).textContent);
      }
    }
  });
};

// 添加额外的检查和初始化机制，确保悬浮目录正确显示
watch(tocItems, (newItems) => {
  console.log('[悬浮目录] tocItems变化，新数据长度:', newItems.length);
  if (newItems.length > 0 && hasToc.value) {
    nextTick(() => {
      updateFloatingToc();
    });
  }
});
</script>

<style scoped>
.article-container {
  @apply max-w-4xl mx-auto px-4 py-8;
}

.reading-progress-container {
  @apply fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-700;
}

.reading-progress-bar {
  @apply h-full bg-blue-600 dark:bg-blue-500 transition-all duration-200;
}

.article-layout {
  @apply flex flex-col md:flex-row gap-6;
}

.article-main {
  @apply w-full;
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

.no-content-tip {
  @apply text-center py-8 text-gray-500 dark:text-gray-400 italic;
}

/* 添加一个全局的暗模式样式类 */
:global(.dark) .article-markdown {
  @apply bg-gray-800 text-gray-200;
}

:global(.dark) .article-markdown pre {
  @apply bg-gray-900;
}

:global(.dark) .article-markdown code {
  @apply bg-gray-900 text-blue-300;
}

:global(.dark) .article-markdown blockquote {
  @apply bg-gray-700 border-l-blue-500;
}

:global(.dark) .article-markdown a {
  @apply text-blue-400;
}

:global(.dark) .article-markdown h1,
:global(.dark) .article-markdown h2,
:global(.dark) .article-markdown h3,
:global(.dark) .article-markdown h4,
:global(.dark) .article-markdown h5,
:global(.dark) .article-markdown h6 {
  @apply text-white border-b border-gray-700;
}

:global(.dark) .article-markdown table {
  @apply border-gray-700;
}

:global(.dark) .article-markdown th {
  @apply bg-gray-700 text-gray-200 border-gray-600;
}

:global(.dark) .article-markdown td {
  @apply border-gray-700;
}

:global(.dark) .article-markdown hr {
  @apply border-gray-700;
}

:global(.dark) .article-markdown img {
  @apply bg-gray-800;
}
</style>