<!-- Toc.vue -->
<template>
    <div class="toc" ref="tocContainerRef" :class="{'dark-theme': theme === 'dark'}">
      <h3>我是目录😁</h3>
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
  import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
  import { useTheme } from '@/utils/helpers/theme'

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
  
  // 定义事件发射
  const emit = defineEmits<{
    'item-click': [id: string]
  }>();
  
  const tocContainerRef = ref<HTMLElement | null>(null);
  const tocItems = ref<TocItem[]>([]);
  const activeId = ref<string | null>(null);
  const lastActiveId = ref<string | null>(null);
  const idMap = new Map<string, number>();
  
  // 根据阅读进度判断目录项是否已读
  const isItemRead = (_item: TocItem, index: number): boolean => {
    // 当前激活项之前的所有项都标记为已读
    if (!activeId.value) return false;
    
    const activeIndex = tocItems.value.findIndex(i => i.id === activeId.value);
    if (activeIndex === -1) return false;
    
    return index <= activeIndex;
  };
  
  // 生成唯一ID
  const generateUniqueId = (text: string, index: number): string => {
    const baseId = text.trim().toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      .replace(/\s+/g, '-') || 'heading';
    
    const uniqueId = `${baseId}-${index}`;
    
    if (idMap.has(uniqueId)) {
      const count = idMap.get(uniqueId)! + 1;
      idMap.set(uniqueId, count);
      return `${uniqueId}-${count}`;
    } else {
      idMap.set(uniqueId, 1);
      return uniqueId;
    }
  };
  
  // 从DOM中提取标题
  const generateTOCFromDOM = () => {
    idMap.clear();
    
    setTimeout(() => {
      const articleContent = document.querySelector('.md-editor-preview');
      if (!articleContent) return;
      
      const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) return;
      
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const originalId = heading.id;
        const text = heading.textContent || `标题 ${index+1}`;
        const uniqueId = generateUniqueId(text, index);
        
        heading.id = uniqueId;
        
        items.push({
          id: uniqueId,
          text: text,
          level: parseInt(heading.tagName.substring(1), 10),
          originalId: originalId || undefined
        });
      });
      
      tocItems.value = items;
      
      setTimeout(() => {
        handleScroll();
        debouncedScrollActiveItem();
      }, 800);
    }, 500);
  };
  
  // 从内容字符串生成目录
  const generateTOCFromContent = () => {
    if (!props.content) return;
    
    try {
      idMap.clear();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");
      const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
      
      if (headings.length === 0) return generateTOCFromDOM();
      
      const items: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const originalId = heading.id;
        const text = heading.textContent || `标题 ${index+1}`;
        const uniqueId = generateUniqueId(text, index);
        
        heading.id = uniqueId;
        
        items.push({
          id: uniqueId,
          text: text,
          level: parseInt(heading.tagName.substring(1), 10),
          originalId: originalId || undefined
        });
      });
      
      tocItems.value = items;
      
      setTimeout(() => {
        handleScroll();
        debouncedScrollActiveItem();
      }, 600);
    } catch (error) {
      generateTOCFromDOM();
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
    
    // 发射点击事件
    emit('item-click', id);
  };
  
  // 滚动防抖
  let scrollTimeout: number | null = null;
  const debounceScroll = (fn: Function, delay: number = 100) => {
    return (...args: any[]) => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => fn.apply(null, args), delay) as unknown as number;
    };
  };

      // 自动滚动函数，确保当前激活项始终在可视区域的合适位置
  const scrollActiveItemToCenter = () => {
    if (!activeId.value || !tocContainerRef.value) {
      return;
    }
    
    // 使用 nextTick 确保 DOM 完全更新
    nextTick(() => {
      if (!tocContainerRef.value) return;
      
      // 查找当前激活的目录项元素
      let activeItem: HTMLElement | null = null;
      
      // 优先使用href属性精确查找
      const allItems = tocContainerRef.value.querySelectorAll('.toc-item');
      for (const item of allItems) {
        const link = item.querySelector('.toc-item-link') as HTMLAnchorElement;
        if (link && link.getAttribute('href') === `#${activeId.value}`) {
          activeItem = item as HTMLElement;
          break;
        }
      }
      
      // 备用方案：使用CSS类查找
      if (!activeItem) {
        activeItem = tocContainerRef.value.querySelector('.toc-item.active') as HTMLElement;
      }
      
      if (!activeItem) return;
      
      // 确定正确的滚动容器
      let scrollContainer = tocContainerRef.value;
      const sidebarTocWrapper = document.getElementById('sidebar-toc-container');
      if (sidebarTocWrapper && sidebarTocWrapper.contains(tocContainerRef.value)) {
        scrollContainer = sidebarTocWrapper;
      }
      
      // 获取容器和项目的尺寸信息
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = containerRect.height;
      const containerScrollHeight = scrollContainer.scrollHeight;
      const itemOffsetTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      
      // 设置理想的边距和中心区域
      const topMargin = 80;    // 顶部安全边距
      const bottomMargin = 80; // 底部安全边距
      const centerZone = containerHeight * 0.4; // 中心区域高度（容器的40%）
      const centerStart = containerHeight * 0.3; // 中心区域开始位置（容器的30%）
      
      const visibleTop = containerScrollTop;
      const visibleBottom = containerScrollTop + containerHeight;
      const itemTop = itemOffsetTop;
      const itemBottom = itemOffsetTop + itemHeight;
      
      // 检查项目是否在理想的中心区域内
      const itemInCenterZone = 
        itemTop >= visibleTop + centerStart && 
        itemBottom <= visibleTop + centerStart + centerZone;
      
      // 检查项目是否完全可见
      const itemFullyVisible = 
        itemTop >= visibleTop + topMargin && 
        itemBottom <= visibleBottom - bottomMargin;
      
      // 只有当项目不在中心区域或不完全可见时才滚动
      if (!itemInCenterZone || !itemFullyVisible) {
        // 计算理想滚动位置：将项目放在容器的30%-35%位置（偏上的中心位置）
        let targetScrollTop = itemOffsetTop - (containerHeight * 0.32);
        
        // 边界处理：确保不会滚动到容器边界外
        const maxScroll = Math.max(0, containerScrollHeight - containerHeight);
        targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop));
        
        // 执行平滑滚动
        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    });
  };
  
  const debouncedScrollActiveItem = debounceScroll(scrollActiveItemToCenter, 100);
  
  const handleScroll = () => {
    let found = null;
    const viewportOffset = 120;
    
    // 从下往上遍历，找到最接近视口顶部的标题
    for (let i = tocItems.value.length - 1; i >= 0; i--) {
      const item = tocItems.value[i];
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportOffset) {
          found = item.id;
          break;
        }
      }
    }
    
    // 如果没有找到合适的项，尝试选择第一个可见的标题
    if (!found && tocItems.value.length > 0) {
      const firstItem = tocItems.value[0];
      const firstEl = document.getElementById(firstItem.id);
      if (firstEl) {
        const rect = firstEl.getBoundingClientRect();
        if (rect.top > 0 && rect.top < window.innerHeight) {
          found = firstItem.id;
        }
      }
    }
    
    // 只有当活动项变化时才更新状态
    if (found !== activeId.value) {
      lastActiveId.value = activeId.value;
      activeId.value = found;
    }
  };
  
  // 监听目录内容变化，重新生成目录
  watch(() => props.content, () => {
    generateTOCFromContent();
  }, { immediate: true });
  
  // 监听活动项变化，保持滚动位置
  watch(() => activeId.value, (newActiveId, oldActiveId) => {
    if (newActiveId && newActiveId !== oldActiveId) {
      debouncedScrollActiveItem();
    }
  });
  
  onMounted(() => {
    if (props.content) {
      generateTOCFromContent();
    } else {
      generateTOCFromDOM();
    }
    
    setTimeout(() => {
      if (tocItems.value.length === 0) {
        generateTOCFromDOM();
      } else {
        handleScroll();
        debouncedScrollActiveItem();
      }
    }, 1000);
    
    window.addEventListener("scroll", handleScroll);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
      scrollTimeout = null;
    }
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