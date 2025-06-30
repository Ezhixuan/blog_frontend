<template>
    <teleport to="body" v-if="isExpanded">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click="handleClose"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'question-title-' + id"
      >
        <div class="expanded-card-container relative w-full max-w-3xl">
          <!-- 关闭按钮，放在容器外部确保始终可见 -->
          <button
            class="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-gray-700 dark:text-white"
            @click.stop="handleClose" 
            aria-label="关闭卡片"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <!-- 删除按钮 - 仅管理员可见 -->
          <button
            v-if="canDelete"
            class="absolute top-4 right-16 z-50 p-2 rounded-full bg-red-500/90 hover:bg-red-600 shadow-md text-white"
            @click.stop="handleDeleteClick" 
            aria-label="删除卡片"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>

          <!-- 上一张卡片预览 -->
          <div 
            v-if="hasPrevCard"
            class="prev-card absolute left-0 top-1/2 -translate-y-1/2 -translate-x-60 z-10 w-48 h-40 opacity-70 hover:opacity-95 transition-all duration-300 cursor-pointer hover:z-40"
            @click.stop="navigateToPrevCard"
          >
            <div class="prev-card-inner bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
              <div class="bg-blue-100 dark:bg-blue-900 p-2 text-xs font-medium text-blue-800 dark:text-blue-200">上一张</div>
              <div class="p-3 text-sm overflow-hidden text-gray-700 dark:text-gray-300">
                {{ prevCardQuestion }}
              </div>
            </div>
            <!-- 左箭头指示器 -->
            <div class="absolute left-full top-1/2 -translate-y-1/2 translate-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          
          <!-- 当前卡片容器 -->
          <div 
            class="current-card-wrapper relative perspective-1000 transition-transform duration-500"
            :class="{'slide-left': isSlideLeft, 'slide-right': isSlideRight}"
          >
            <div 
              class="relative w-full aspect-video rounded-xl overflow-hidden"
              @click.stop="handleExpandedClick"
            >
              <!-- 卡片翻转包装器 -->
              <div class="flip-card w-full h-full" :class="{ 'flipped': expandedIsFlipped }">
                <!-- 正面 - 问题 -->
                <div class="flip-card-front w-full h-full rounded-xl p-10 flex flex-col bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
                  <h3 :id="'question-title-' + id" class="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">问题：</h3>
                  <div class="overflow-y-auto flex-grow">
                    <p class="text-xl leading-relaxed text-gray-800 dark:text-white whitespace-pre-wrap">{{ question }}</p>
                  </div>
                  <div class="pt-4 text-sm text-gray-500 dark:text-gray-400">点击查看答案</div>
                </div>
                
                <!-- 背面 - 答案 -->
                <div class="flip-card-back w-full h-full rounded-xl p-10 flex flex-col bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
                  <h3 class="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">答案：</h3>
                  <div class="overflow-y-auto flex-grow">
                    <p class="text-xl leading-relaxed text-gray-800 dark:text-white whitespace-pre-wrap">{{ answer }}</p>
                  </div>
                  <div class="pt-4 text-sm text-gray-500 dark:text-gray-400">点击返回问题</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 下一张卡片预览 -->
          <div 
            v-if="hasNextCard"
            class="next-card absolute right-0 top-1/2 -translate-y-1/2 translate-x-60 z-10 w-48 h-40 opacity-70 hover:opacity-95 transition-all duration-300 cursor-pointer hover:z-40"
            @click.stop="navigateToNextCard"
          >
            <div class="next-card-inner bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
              <div class="bg-blue-100 dark:bg-blue-900 p-2 text-xs font-medium text-blue-800 dark:text-blue-200">下一张</div>
              <div class="p-3 text-sm overflow-hidden text-gray-700 dark:text-gray-300">
                {{ nextCardQuestion }}
              </div>
            </div>
            <!-- 右箭头指示器 -->
            <div class="absolute right-full top-1/2 -translate-y-1/2 -translate-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  
    <!-- 卡片普通视图 -->
    <div
      class="flashcard-container relative h-64 rounded-xl shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
      @click="handleClick" 
      @dblclick="handleDoubleClick" 
      role="button"
      tabindex="0"
      @keydown.enter="handleClick"
      @keydown.space="handleClick"
    >
      <!-- 删除按钮 - 小卡片视图，仅管理员可见 -->
      <button
        v-if="canDelete"
        class="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-red-500/90 hover:bg-red-600 shadow-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        @click.stop="handleDeleteClick"
        aria-label="删除卡片"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>

      <!-- 使用另一种更简单的3D翻转实现 -->
      <div class="flip-card-mini w-full h-full" :class="{ 'flipped': isFlipped }">
        <!-- 正面 - 问题 -->
        <div class="flip-card-front-mini w-full h-full rounded-xl p-6 flex flex-col bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <h3 class="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">问题：</h3>
          <div class="overflow-y-auto flex-grow">
            <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ question }}</p>
          </div>
          <div class="pt-2 text-xs text-gray-500 dark:text-gray-400">双击放大</div>
        </div>
      
        <!-- 背面 - 答案 -->
        <div class="flip-card-back-mini w-full h-full rounded-xl p-6 flex flex-col bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
          <h3 class="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">答案：</h3>
          <div class="overflow-y-auto flex-grow">
            <p class="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ answer }}</p>
          </div>
          <div class="pt-2 text-xs text-gray-500 dark:text-gray-400">双击放大</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  
  // Define component properties
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    // 添加索引和总数，用于导航
    index: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    // 相邻卡片数据
    prevCard: {
      type: Object,
      default: () => ({})
    },
    nextCard: {
      type: Object,
      default: () => ({})
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  });
  
  // Define events emitted by the component
  const emit = defineEmits(['expand', 'navigate', 'delete']);
  
  // 卡片翻转状态
  const isFlipped = ref(false);
  const expandedIsFlipped = ref(false);
  
  // 卡片导航状态和动画
  const isSlideLeft = ref(false);
  const isSlideRight = ref(false);
  
  // 计算属性：是否有前后卡片
  const hasPrevCard = computed(() => props.prevCard && props.prevCard.id);
  const hasNextCard = computed(() => props.nextCard && props.nextCard.id);
  
  // 相邻卡片的问题内容
  const prevCardQuestion = computed(() => {
    if (!props.prevCard) return '';
    return props.prevCard.front || props.prevCard.question || '';
  });
  
  const nextCardQuestion = computed(() => {
    if (!props.nextCard) return '';
    return props.nextCard.front || props.nextCard.question || '';
  });
  
  // 监听展开状态变化
  watch(() => props.isExpanded, (newValue, oldValue) => {
    if (!newValue && oldValue) {
      isFlipped.value = false;
      expandedIsFlipped.value = false;
      // 重置滑动状态
      resetSlideState();
    }
    if (newValue && !oldValue) {
      expandedIsFlipped.value = false;
    }
  });
  
  // 普通卡片点击处理
  const handleClick = () => {
    if (!props.isExpanded) {
      isFlipped.value = !isFlipped.value;
    }
  };
  
  // 双击扩展处理
  const handleDoubleClick = (e) => {
    if (props.isExpanded) return;
    e.stopPropagation();
    emit('expand', { id: props.id, expand: true });
  };
  
  // 展开模式点击处理
  const handleExpandedClick = (e) => {
    e.stopPropagation();
    expandedIsFlipped.value = !expandedIsFlipped.value;
  };
  
  // 关闭展开模式
  const handleClose = (e) => {
    e.stopPropagation();
    emit('expand', { id: props.id, expand: false });
  };
  
  // 重置滑动状态
  const resetSlideState = () => {
    isSlideLeft.value = false;
    isSlideRight.value = false;
  };
  
  // 导航到上一张卡片
  const navigateToPrevCard = (e) => {
    if (!hasPrevCard.value) return;
    e.stopPropagation();
    
    // 应用右滑动画
    isSlideRight.value = true;
    
    // 延迟导航以允许动画完成
    setTimeout(() => {
      emit('navigate', { direction: 'prev', cardId: props.prevCard.id });
      resetSlideState();
    }, 300);
  };
  
  // 导航到下一张卡片
  const navigateToNextCard = (e) => {
    if (!hasNextCard.value) return;
    e.stopPropagation();
    
    // 应用左滑动画
    isSlideLeft.value = true;
    
    // 延迟导航以允许动画完成
    setTimeout(() => {
      emit('navigate', { direction: 'next', cardId: props.nextCard.id });
      resetSlideState();
    }, 300);
  };

  // 删除卡片处理
  const handleDeleteClick = () => {
    emit('delete', { id: props.id });
  };
  </script>
  
  <style scoped>
  /* 基础透视样式 */
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .flashcard-container {
    perspective: 1000px;
  }
  
  /* ===== 放大卡片样式 ===== */
  .flip-card {
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  
  .flip-card.flipped {
    transform: rotateY(180deg);
  }
  
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .flip-card-back {
    transform: rotateY(180deg);
  }
  
  /* ===== 小卡片样式 ===== */
  .flip-card-mini {
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flip-card-mini.flipped {
    transform: rotateY(180deg);
  }
  
  .flip-card-front-mini, .flip-card-back-mini {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .flip-card-back-mini {
    transform: rotateY(180deg);
  }
  
  /* 卡片导航和动画 */
  .prev-card, .next-card {
    transition: opacity 0.3s ease, box-shadow 0.3s ease;
    z-index: 10;
  }
  
  /* 移除之前添加的padding和margin */
  /* 为卡片内容添加一个包装器，只缩放内容而不移动整个卡片 */
  .prev-card-inner, .next-card-inner {
    transition: transform 0.3s ease;
    position: relative;
    height: 100%;
  }
  
  /* 使用伪元素扩大热区，但不影响视觉布局 */
  .prev-card::before, .next-card::before {
    content: '';
    position: absolute;
    top: -20px;
    bottom: -20px;
    width: 60px; /* 扩大热区宽度 */
    z-index: 5;
  }
  
  .prev-card::before {
    left: -30px;
    right: 0;
  }
  
  .next-card::before {
    right: -30px;
    left: 0;
  }
  
  .prev-card:hover, .next-card:hover {
    z-index: 40;
    opacity: 0.95 !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }
  
  .prev-card:hover .prev-card-inner, .next-card:hover .next-card-inner {
    transform: scale(1.05);
  }
  
  /* 滑动动画 */
  .slide-left {
    animation: slideLeft 0.4s ease forwards;
  }
  
  .slide-right {
    animation: slideRight 0.4s ease forwards;
  }
  
  @keyframes slideLeft {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-30px);
      opacity: 0;
    }
  }
  
  @keyframes slideRight {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(30px);
      opacity: 0;
    }
  }
  
  /* 内容滚动条美化 */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  
  /* 暗色模式下滚动条 */
  @media (prefers-color-scheme: dark) {
    .overflow-y-auto {
      scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: rgba(75, 85, 99, 0.5);
    }
  }
  
  /* 暗色模式增强 */
  @media (prefers-color-scheme: dark) {
    .flip-card-front, .flip-card-back,
    .flip-card-front-mini, .flip-card-back-mini {
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }
  }
  </style>