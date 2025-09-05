<template>
  <div class="toc-section">
    <!-- 目录模式下的快速导航 -->
    <div class="toc-quick-nav">
      <router-link to="/blogs" class="quick-nav-btn">
        <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <span>返回博客</span>
      </router-link>
      <router-link to="/" class="quick-nav-btn">
        <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>首页</span>
      </router-link>
    </div>
    
    <h3 class="section-title">
      <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
      文章目录
    </h3>
    <div class="toc-wrapper" id="sidebar-toc-container">
      <Toc 
        :content="articleContent" 
        ref="tocRef"
        class="sidebar-toc"
      />
    </div>
    
    <!-- 目录模式下的控制按钮 -->
    <div class="toc-controls">
      <button
        @click="toggleTheme"
        class="control-btn"
        :class="{ dark: currentTheme === 'dark' }"
        title="切换主题"
      >
        <svg v-show="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="control-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
        <svg v-show="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="control-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Toc from '@/components/business/Blog/Toc.vue';
import { useTheme } from '@/utils/helpers/theme';

// --- Props ---
defineProps<{
  articleContent: string;
}>();

// --- Composables ---
const { currentTheme, toggleTheme } = useTheme();

// --- Refs ---
const tocRef = ref<any>(null);
</script>

<style scoped>
.toc-section {
  @apply mb-8 animate-fade-slow;
  animation-delay: 0.15s;
}

.toc-section .section-title {
  @apply flex items-center gap-3 text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.dark .toc-section .section-title {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-icon {
  @apply w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0;
  -webkit-text-fill-color: currentColor !important;
}

.toc-wrapper {
  @apply bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/60;
  max-height: 480px;
  @apply overflow-y-auto overflow-x-hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  scroll-behavior: smooth;
  position: relative;
  height: auto;
}

.toc-wrapper:hover {
  @apply bg-gray-100/80 dark:bg-gray-700/50;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.sidebar-toc {
  @apply bg-transparent border-0 shadow-none p-0 rounded-none;
  max-height: none !important;
  overflow: visible !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.sidebar-toc .toc h3 {
  @apply hidden;
}

.sidebar-toc .reading-progress-bar {
  @apply hidden;
}

.sidebar-toc .toc-item-link {
  @apply text-sm py-2 px-3;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.sidebar-toc .toc-item-text {
  @apply text-xs leading-relaxed;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.toc-wrapper::-webkit-scrollbar {
  width: 6px;
}

.toc-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.toc-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.toc-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

.dark .toc-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .toc-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark .toc-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.toc-quick-nav {
  @apply mb-6 flex gap-2;
}

.quick-nav-btn {
  @apply flex-1 flex items-center justify-center gap-2 px-3 py-2.5;
  @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30;
  @apply text-blue-700 dark:text-blue-300 text-sm font-medium rounded-xl;
  @apply border border-blue-200/60 dark:border-blue-800/60;
  @apply transition-all duration-200 hover:scale-105 active:scale-95;
  @apply hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  text-decoration: none;
}

.quick-nav-btn:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px) scale(1.02);
}

.quick-nav-icon {
  @apply w-4 h-4;
}

.quick-nav-btn span {
  @apply text-xs font-medium;
}

.toc-controls {
  @apply mt-6 flex justify-center;
}

.control-btn {
  @apply w-10 h-10 flex items-center justify-center rounded-full;
  @apply bg-gray-100/80 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/50;
  @apply transition-all duration-200 active:scale-95;
  @apply border border-gray-200/60 dark:border-gray-600/50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.control-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.control-btn.dark {
  @apply bg-gray-600/60 hover:bg-gray-500/60;
}

.control-icon {
  @apply w-5 h-5 text-gray-600 dark:text-gray-300;
  transition: color 0.2s ease;
}

.control-btn:hover .control-icon {
  @apply text-gray-800 dark:text-white;
}

.animate-fade-slow {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
