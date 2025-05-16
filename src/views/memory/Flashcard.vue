<template>
    <teleport to="body" v-if="isExpanded">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click="handleClose"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'question-title-' + id"
      >
        <div class="expanded-card-container relative w-full max-w-2xl perspective-1000">
          <!-- 关闭按钮，放在容器外部确保始终可见 -->
          <button
            class="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/90 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md text-gray-700 dark:text-white"
            @click.stop="handleClose" 
            aria-label="关闭卡片"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <!-- 卡片容器 -->
          <div 
            class="relative w-full aspect-video rounded-xl overflow-hidden"
            @click.stop="handleExpandedClick"
          >
            <!-- 卡片翻转包装器 -->
            <div class="flip-card w-full h-full" :class="{ 'flipped': expandedIsFlipped }">
              <!-- 正面 - 问题 -->
              <div class="flip-card-front w-full h-full rounded-xl p-10 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
                <h3 :id="'question-title-' + id" class="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">问题：</h3>
                <p class="text-xl leading-relaxed text-gray-800 dark:text-white">{{ question }}</p>
                <div class="absolute bottom-6 right-6 text-sm text-gray-500 dark:text-gray-400">点击查看答案</div>
              </div>
              
              <!-- 背面 - 答案 -->
              <div class="flip-card-back w-full h-full rounded-xl p-10 flex flex-col justify-center bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
                <h3 class="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">答案：</h3>
                <p class="text-xl leading-relaxed text-gray-800 dark:text-white">{{ answer }}</p>
                <div class="absolute bottom-6 right-6 text-sm text-gray-500 dark:text-gray-400">点击返回问题</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  
    <!-- 卡片普通视图 -->
    <div
      class="flashcard-container relative h-64 rounded-xl shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300"
      @click="handleClick" 
      @dblclick="handleDoubleClick" 
      role="button"
      tabindex="0"
      @keydown.enter="handleClick"
      @keydown.space="handleClick"
    >
      <!-- 使用另一种更简单的3D翻转实现 -->
      <div class="flip-card-mini w-full h-full" :class="{ 'flipped': isFlipped }">
        <!-- 正面 - 问题 -->
        <div class="flip-card-front-mini w-full h-full rounded-xl p-6 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <h3 class="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">问题：</h3>
          <p class="text-gray-700 dark:text-gray-200">{{ question }}</p>
          <div class="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">双击放大</div>
        </div>
      
        <!-- 背面 - 答案 -->
        <div class="flip-card-back-mini w-full h-full rounded-xl p-6 flex flex-col justify-center bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
          <h3 class="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">答案：</h3>
          <p class="text-gray-700 dark:text-gray-200">{{ answer }}</p>
          <div class="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400">双击放大</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
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
    }
  });
  
  // Define events emitted by the component
  const emit = defineEmits(['expand']);
  
  // 维护两个独立的翻转状态
  const isFlipped = ref(false);
  const expandedIsFlipped = ref(false);
  
  // 监听展开状态变化
  watch(() => props.isExpanded, (newValue, oldValue) => {
    if (!newValue && oldValue) {
      isFlipped.value = false;
      expandedIsFlipped.value = false;
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
  }
  
  .flip-card-back-mini {
    transform: rotateY(180deg);
  }
  
  /* 暗色模式增强 */
  @media (prefers-color-scheme: dark) {
    .flip-card-front, .flip-card-back,
    .flip-card-front-mini, .flip-card-back-mini {
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }
  }
  </style>