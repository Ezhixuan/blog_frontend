<template>
  <div class="group relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 hover:border-blue-200/50 dark:hover:border-blue-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 rounded-3xl transform hover:-translate-y-2 hover:scale-105">
    
    <!-- 装饰性渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/30 dark:via-transparent dark:to-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <!-- 管理员选择复选框 -->
    <div v-if="isAdmin" class="absolute top-6 left-6 z-30">
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          :checked="isSelected"
          @change="$emit('toggleSelect', project.id)"
          type="checkbox"
          class="sr-only peer"
        />
        <div class="w-6 h-6 bg-white/90 dark:bg-slate-700/90 border-2 border-slate-300 dark:border-slate-600 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 peer-checked:border-transparent transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
          <svg v-if="isSelected" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
      </label>
    </div>

    <!-- 精选标签 -->
    <div v-if="project.featured" class="absolute top-6 right-6 z-20">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
        <span class="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
          <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          精选
        </span>
      </div>
    </div>

    <!-- 管理员快捷操作 -->
    <div v-if="isAdmin" class="absolute top-6 right-6 z-30 flex gap-2" :class="{ 'right-20': project.featured }">
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button
          @click="$emit('toggleFeatured', project)"
          :title="project.featured ? '取消推荐' : '推荐项目'"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/95 dark:bg-slate-700/95 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/50 dark:border-slate-600/50 hover:scale-110"
        >
          <svg class="w-4 h-4" :class="project.featured ? 'text-yellow-600' : 'text-slate-400 dark:text-slate-500'" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
        <button
          @click="$emit('edit', project)"
          title="编辑项目"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/95 dark:bg-slate-700/95 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/50 dark:border-slate-600/50 hover:scale-110"
        >
          <svg class="w-4 h-4 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        <button
          @click="$emit('delete', project)"
          title="删除项目"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/95 dark:bg-slate-700/95 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/50 dark:border-slate-600/50 hover:scale-110"
        >
          <svg class="w-4 h-4 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 项目图片 -->
    <div class="relative overflow-hidden rounded-t-3xl">
      <div class="aspect-video relative">
        <img
          :src="project.image || '/placeholder.svg'"
          :alt="project.title"
          class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <!-- 渐变遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- 悬停时显示的项目信息 -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div class="text-center">
            <div class="flex items-center justify-center gap-4 mb-4">
              <div v-if="project.stars" class="flex items-center gap-1 text-white">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="font-semibold">{{ project.stars }}</span>
              </div>
              <div v-if="project.views" class="flex items-center gap-1 text-white">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="font-semibold">{{ project.views }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目信息 -->
    <div class="p-8 relative z-10">
      <!-- 标题和描述 -->
      <div class="pb-6">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
            {{ project.title }}
          </h3>
        </div>
        <p class="text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{{ project.description }}</p>
        <p v-if="project.longDescription" class="text-sm text-slate-500 dark:text-slate-500 line-clamp-2 leading-relaxed">
          {{ project.longDescription }}
        </p>
      </div>

      <!-- 技术栈标签 -->
      <div class="pb-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="(tech, index) in project.technologies.slice(0, 4)"
            :key="tech"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/70 dark:hover:to-indigo-900/70 transition-all duration-200 hover:scale-105"
            :style="`animation-delay: ${index * 0.1}s`"
          >
            {{ tech }}
          </span>
          <span
            v-if="project.technologies.length > 4"
            class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200/50 dark:border-slate-600/50"
          >
            +{{ project.technologies.length - 4 }}
          </span>
        </div>

        <!-- 项目统计信息 -->
        <div class="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="font-medium">{{ formatDate(project.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button
          v-if="project.liveUrl"
          @click="$emit('view', project)"
          class="group flex-1 relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg class="w-4 h-4 mr-2 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
          </svg>
          <span class="relative z-10">查看项目</span>
        </button>
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex-1 relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
          </svg>
          源码
        </a>
        <button
          v-if="project.hasArticles"
          @click="$emit('view-articles', project)"
          class="group flex-1 relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v1a1 1 0 102 0v-1zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
          项目文档
        </button>
      </div>
    </div>

    <!-- 底部装饰渐变 -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { ProjectQueryVO } from "@/types";

interface Props {
  project: ProjectQueryVO
  isAdmin?: boolean
  isSelected?: boolean
}

interface Emits {
  (e: 'toggleSelect', projectId: string): void
  (e: 'edit', project: ProjectQueryVO): void
  (e: 'delete', project: ProjectQueryVO): void
  (e: 'toggleFeatured', project: ProjectQueryVO): void
  (e: 'view', project: ProjectQueryVO): void
  (e: 'view-articles', project: ProjectQueryVO): void
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
  isSelected: false
})

const emit = defineEmits<Emits>()

// 避免TypeScript未使用变量错误
void props
void emit

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.group:hover .group-hover\:float {
  animation: float 3s ease-in-out infinite;
}

/* 技术栈标签的进入动画 */
.group:hover span:nth-child(1) { animation-delay: 0s; }
.group:hover span:nth-child(2) { animation-delay: 0.1s; }
.group:hover span:nth-child(3) { animation-delay: 0.2s; }
.group:hover span:nth-child(4) { animation-delay: 0.3s; }
</style>
