<template>
  <transition name="fade">
    <div 
      v-show="visible" 
      @click="scrollToTop"
      class="back-to-top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 滚动阈值，超过这个值才显示按钮
const props = defineProps({
  visibilityHeight: {
    type: Number,
    default: 300
  },
  // 回到顶部的动画时长
  duration: {
    type: Number,
    default: 500
  }
});

const visible = ref(false);

// 监听滚动事件，控制按钮显示隐藏
const handleScroll = () => {
  visible.value = window.scrollY > props.visibilityHeight;
};

// 滚动到顶部
const scrollToTop = () => {
  const startPosition = window.scrollY;
  const startTime = performance.now();
  
  function step(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    
    // 使用缓动函数使滚动更平滑
    const progress = Math.min(elapsedTime / props.duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // 缓动函数：ease-out-cubic
    
    window.scrollTo(0, startPosition * (1 - easeProgress));
    
    if (elapsedTime < props.duration) {
      window.requestAnimationFrame(step);
    }
  }
  
  window.requestAnimationFrame(step);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top {
  @apply fixed right-6 bottom-6 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center cursor-pointer z-50 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 