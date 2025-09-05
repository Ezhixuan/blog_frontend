<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 border border-white/20 dark:border-slate-700/50 animate-scale-in">
      
      <!-- 装饰性背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-orange-50/30 dark:from-red-950/20 dark:via-transparent dark:to-orange-950/20 rounded-3xl pointer-events-none"></div>
      
      <!-- 模态框头部 -->
      <div class="relative z-10 p-8 border-b border-slate-200/50 dark:border-slate-700/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">
              {{ title }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              请确认您的操作
            </p>
          </div>
        </div>
      </div>

      <!-- 模态框内容 -->
      <div class="relative z-10 p-8">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              {{ message }}
            </p>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="relative z-10 flex justify-end items-center gap-3 p-8 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
          @click="$emit('cancel')"
          class="px-8 py-3 text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/50 dark:border-slate-600/50 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
          :class="confirmClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确认',
  cancelText: '取消',
  confirmClass: ''
})

const emit = defineEmits<Emits>()

// 避免TypeScript未使用变量错误
void props
void emit
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

 .animate-scale-in {
   animation: scale-in 0.3s ease-out;
 }
</style> 