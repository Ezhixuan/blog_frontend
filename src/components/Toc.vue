<!-- Toc.vue -->
<template>
    <div class="toc" ref="tocContainerRef" :class="{'dark-theme': theme === 'dark'}">
      <h3>目录</h3>
      <div class="reading-progress-bar" :style="{ width: `${readingProgress}%` }"></div>
      <div class="toc-items-container">
        <div
          v-for="(item, index) in tocItems"
          :key="item.id"
          :class="[
            'toc-item',
            { 'active': item.id === activeId },
            { 'read': isItemRead(item, index) },
            `level-${item.level}`
          ]"
          :ref="item.id === activeId ? (el) => { activeItemRef = el as HTMLElement } : undefined"
        >
          <div class="toc-item-progress">
            <div class="toc-item-indicator"></div>
          </div>
          <a
            :href="`#${item.id}`"
            @click.prevent="handleClick(item.id)"
            :style="{ 
              'padding-left': `${(item.level - 1) * 12 + 8}px`,
              '--item-index': index 
            }"
            class="toc-item-link"
          >
            <span class="toc-item-bullet"></span>
            <span class="toc-item-text">{{ item.text }}</span>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch, computed, inject, nextTick } from 'vue';
  import { useTheme } from '../utils/theme'

  const { currentTheme } = useTheme();
  const theme = computed(() => currentTheme.value);
  
  interface TocItem {
    id: string;
    text: string;
    level: number;
    originalId?: string; // 保存原始ID以便引用
  }
  
  const props = defineProps<{
    content: string;
  }>();
  
  // 尝试从父组件获取阅读进度
  const readingProgress = ref(0);
  const readingProgressFromParent = inject('readingProgress', 0);
  const tocContainerRef = ref<HTMLElement | null>(null);
  const activeItemRef = ref<HTMLElement | null>(null);
  const lastActiveId = ref<string | null>(null);
  
  // 监听从父组件注入的阅读进度
  watch(() => readingProgressFromParent, (newVal) => {
    if (typeof newVal === 'number') {
      readingProgress.value = newVal;
    }
  }, { immediate: true });
  
  const tocItems = ref<TocItem[]>([]);
  const activeId = ref<string | null>(null);
  const idMap = new Map<string, number>(); // 用于跟踪ID使用次数
  
  // 根据阅读进度判断目录项是否已读
  const isItemRead = (item: TocItem, index: number): boolean => {
    // 当前激活项之前的所有项都标记为已读
    if (!activeId.value) return false;
    
    const activeIndex = tocItems.value.findIndex(i => i.id === activeId.value);
    if (activeIndex === -1) return false;
    
    return index <= activeIndex;
  };
  
  // 生成唯一ID
  const generateUniqueId = (text: string, index: number): string => {
    // 清理文本，只保留字母、数字和空格，然后替换空格为连字符
    const baseId = text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      .replace(/\s+/g, '-');
      
    // 确保基础ID不为空
    const safeBaseId = baseId || 'heading';
    
    // 使用基础ID、位置索引和计数器生成唯一ID
    const uniqueId = `${safeBaseId}-${index}`;
    
    // 检查ID是否已存在，如果存在则添加计数
    if (idMap.has(uniqueId)) {
      const count = idMap.get(uniqueId)! + 1;
      idMap.set(uniqueId, count);
      return `${uniqueId}-${count}`;
    } else {
      idMap.set(uniqueId, 1);
      return uniqueId;
    }
  };
  
  // 从实际渲染的DOM中提取标题
  const generateTOCFromDOM = () => {
    // 重置ID映射
    idMap.clear();
    
    // 使用setTimeout确保DOM已经完全渲染
    setTimeout(() => {
      const articleContent = document.querySelector('.md-editor-preview');
      if (!articleContent) return;
      
      const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      if (headings.length === 0) {
        console.log('没有找到标题元素');
        return;
      }
      
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const originalId = heading.id;
        const text = heading.textContent || `标题 ${index+1}`;
        const uniqueId = generateUniqueId(text, index);
        
        // 为HTML元素设置新的ID
        heading.id = uniqueId;
        
        items.push({
          id: uniqueId,
          text: text,
          level: parseInt(heading.tagName.substring(1), 10),
          originalId: originalId || undefined
        });
      });
      
      tocItems.value = items;
      console.log('生成目录项:', items.length);
    }, 500);
  };
  
  // 尝试从内容字符串生成目录
  const generateTOCFromContent = () => {
    if (!props.content) return;
    
    try {
      // 重置ID映射
      idMap.clear();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");
      
      const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
      if (headings.length === 0) {
        console.log('解析内容未找到标题');
        return generateTOCFromDOM(); // 回退到DOM方法
      }
      
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const originalId = heading.id;
        const text = heading.textContent || `标题 ${index+1}`;
        const uniqueId = generateUniqueId(text, index);
        
        // 更新元素ID
        heading.id = uniqueId;
        
        items.push({
          id: uniqueId,
          text: text,
          level: parseInt(heading.tagName.substring(1), 10),
          originalId: originalId || undefined
        });
      });
      
      tocItems.value = items;
      console.log('从内容生成目录项:', items.length);
    } catch (error) {
      console.error('解析内容失败:', error);
      generateTOCFromDOM(); // 解析失败时，使用DOM方法
    }
  };
  
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 可以根据实际导航栏高度调整
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };
  
  // 自动将当前激活项滚动到目录的可见区域中央
  const scrollActiveItemToCenter = () => {
    if (!activeId.value || !tocContainerRef.value) return;
    
    // 查找当前激活的DOM元素
    const activeItem = document.querySelector(`.toc-item.active`) as HTMLElement;
    if (!activeItem) return;
    
    // 保存引用以便在DOM更新后访问
    activeItemRef.value = activeItem;
    
    // 使用nextTick确保DOM已更新
    nextTick(() => {
      if (!tocContainerRef.value || !activeItemRef.value) return;
      
      const container = tocContainerRef.value;
      const item = activeItemRef.value;
      
      // 计算滚动位置，使当前项居中
      const containerHeight = container.clientHeight;
      const itemHeight = item.offsetHeight;
      const itemTop = item.offsetTop;
      
      // 设置滚动位置
      const scrollTo = itemTop - (containerHeight / 2) + (itemHeight / 2);
      
      // 使用平滑滚动效果
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    });
  };
  
  // 检查元素是否在容器的可见区域内
  const isElementInView = (element: HTMLElement, container: HTMLElement): boolean => {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // 检查元素是否完全在容器内
    const isInView = (
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom
    );
    
    // 计算元素的可见比例
    const visibleHeight = Math.min(elementRect.bottom, containerRect.bottom) - 
                          Math.max(elementRect.top, containerRect.top);
    const elementHeight = elementRect.height;
    const visibleRatio = visibleHeight / elementHeight;
    
    // 只有当元素不完全可见或者不在中心区域时，才需要滚动
    return isInView && visibleRatio > 0.9;
  };
  
  const handleScroll = () => {
    let found = null;
    
    // 检查所有标题元素
    for (let i = tocItems.value.length - 1; i >= 0; i--) {
      const item = tocItems.value[i];
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // 如果标题在视口上方或接近视口顶部，标记为活动项
        if (rect.top <= 100) {
          found = item.id;
          break;
        }
      }
    }
    
    // 只有当活动项变化时才更新状态
    if (found !== activeId.value) {
      lastActiveId.value = activeId.value;
      activeId.value = found;
      
      // 当活动项变化时，自动滚动目录
      if (found) {
        scrollActiveItemToCenter();
      }
    }
    
    // 计算目录项的阅读进度
    if (tocItems.value.length > 0) {
      if (!found) {
        // 如果没有找到活动项，进度条为0
        readingProgress.value = 0;
      } else {
        const activeIndex = tocItems.value.findIndex(item => item.id === found);
        if (activeIndex >= 0) {
          readingProgress.value = ((activeIndex + 1) / tocItems.value.length) * 100;
        }
      }
    }
  };
  
  // 监听目录内容变化，重新生成目录
  watch(() => props.content, () => {
    generateTOCFromContent();
  }, { immediate: true });
  
  // 监听活动项变化，保持滚动位置
  watch(() => activeId.value, (newActiveId, oldActiveId) => {
    if (newActiveId && newActiveId !== oldActiveId) {
      // 为动画设置微小延迟
      setTimeout(() => {
        scrollActiveItemToCenter();
      }, 50);
    }
  });
  
  onMounted(() => {
    // 尝试从内容生成目录，如果失败则从DOM生成
    if (props.content) {
      generateTOCFromContent();
    } else {
      generateTOCFromDOM();
    }
    
    // 如果内容渲染完成后目录仍为空，尝试再次从DOM生成
    setTimeout(() => {
      if (tocItems.value.length === 0) {
        generateTOCFromDOM();
      }
    }, 1000);
    
    window.addEventListener("scroll", handleScroll);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
  </script>
  
  <style scoped>
  .toc {
    position: relative;
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }
  
  /* 自定义滚动条样式 */
  .toc::-webkit-scrollbar {
    width: 4px;
  }
  
  .toc::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .toc::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  .toc:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  .reading-progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 3px;
    transition: width 0.3s ease;
    z-index: 10;
  }
  
  .toc h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    text-align: center;
    background: linear-gradient(90deg, #2563eb, #4f46e5);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
  }
  
  .toc h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 3px;
  }
  
  .toc-items-container {
    position: relative;
    padding: 0.5rem 0;
  }
  
  .toc-items-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    width: 1px;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    z-index: 1;
  }
  
  .toc-item {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0.15rem 0;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
    animation-delay: calc(var(--item-index) * 0.05s);
    transition: all 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .toc-item-progress {
    position: absolute;
    top: 0;
    left: 10px;
    width: 1px;
    height: 100%;
    z-index: 2;
  }
  
  .toc-item-indicator {
    position: absolute;
    left: -3px;
    top: 50%;
    transform: translateY(-50%) scale(0.6);
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #d1d5db;
    transition: all 0.3s ease;
    z-index: 3;
  }
  
  .toc-item.active {
    transform: translateX(5px);
  }
  
  .toc-item.active .toc-item-indicator,
  .toc-item.read .toc-item-indicator {
    background: #3b82f6;
    transform: translateY(-50%) scale(1);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
  
  .toc-item.active .toc-item-indicator {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }
  
  .toc-item.active .toc-item-progress::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: #3b82f6;
    animation: growDown 0.5s ease;
  }
  
  @keyframes growDown {
    from { height: 0; }
    to { height: 100%; }
  }
  
  .toc-item-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    padding-left: 2rem;
    padding-right: 0.5rem;
    width: 100%;
    font-size: 0.95rem;
    color: #4b5563;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .toc-item-link::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: rgba(59, 130, 246, 0.08);
    transition: width 0.3s ease;
    z-index: -1;
  }
  
  .toc-item-link:hover {
    color: #3b82f6;
  }
  
  .toc-item-link:hover::before {
    width: 100%;
  }
  
  .toc-item.active .toc-item-link {
    color: #3b82f6;
    font-weight: 500;
    background: rgba(59, 130, 246, 0.08);
  }
  
  .toc-item.read .toc-item-link {
    color: #3b82f6;
  }
  
  .toc-item-text {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }
  
  .toc-item.active .toc-item-text {
    transform: translateX(3px);
  }
  
  .toc-item-bullet {
    position: absolute;
    left: 10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d1d5db;
    margin-right: 8px;
    transition: all 0.3s ease;
    display: none;
  }
  
  .toc-item.active .toc-item-bullet {
    background: #3b82f6;
    transform: scale(1.5);
  }
  
  /* 不同级别标题的样式 */
  .toc-item.level-1 .toc-item-link { font-weight: 600; }
  .toc-item.level-2 .toc-item-link { font-weight: 500; }
  .toc-item.level-3 .toc-item-link { font-weight: 400; }
  .toc-item.level-4 .toc-item-link { font-weight: 400; font-size: 0.9rem; }
  .toc-item.level-5 .toc-item-link { font-weight: 400; font-size: 0.85rem; }
  .toc-item.level-6 .toc-item-link { font-weight: 400; font-size: 0.85rem; opacity: 0.9; }
  
  /* 暗色模式适配 */
  .toc.dark-theme {
    background: rgba(15, 23, 42, 0.85);
    border-color: rgba(255, 255, 255, 0.08);
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  }
  
  .toc.dark-theme:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.12);
  }
  
  .toc.dark-theme::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .toc.dark-theme h3 {
    border-bottom-color: rgba(255, 255, 255, 0.08);
    background: linear-gradient(90deg, #60a5fa, #93c5fd);
    -webkit-background-clip: text;
    background-clip: text;
  }
  
  .toc.dark-theme h3::after {
    background: linear-gradient(90deg, #60a5fa, #93c5fd);
  }
  
  .toc.dark-theme .toc-items-container::before {
    background: rgba(255, 255, 255, 0.08);
  }
  
  .toc.dark-theme .toc-item-indicator {
    background: #4b5563;
  }
  
  .toc.dark-theme .toc-item.active .toc-item-indicator,
  .toc.dark-theme .toc-item.read .toc-item-indicator {
    background: #60a5fa;
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
  }
  
  .toc.dark-theme .toc-item.active .toc-item-progress::before {
    background: #60a5fa;
  }
  
  .toc.dark-theme .toc-item-link {
    color: #94a3b8;
  }
  
  .toc.dark-theme .toc-item-link::before {
    background: rgba(96, 165, 250, 0.1);
  }
  
  .toc.dark-theme .toc-item-link:hover {
    color: #60a5fa;
  }
  
  .toc.dark-theme .toc-item.active .toc-item-link {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.12);
  }
  
  .toc.dark-theme .toc-item.read .toc-item-link {
    color: #60a5fa;
  }
  
  .toc.dark-theme .toc-item-bullet {
    background: #4b5563;
  }
  
  .toc.dark-theme .toc-item.active .toc-item-bullet {
    background: #60a5fa;
  }
  
  @keyframes darkPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(96, 165, 250, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
    }
  }
  
  .toc.dark-theme .toc-item.active .toc-item-indicator {
    animation: darkPulse 2s infinite;
  }
  
  /* 滚动过渡效果 */
  .toc-item {
    scroll-margin: 100px;
  }
  </style>