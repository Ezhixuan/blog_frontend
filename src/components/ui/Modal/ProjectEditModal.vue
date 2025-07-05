<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-all duration-300 border border-white/20 dark:border-slate-700/50 animate-scale-in">
      
      <!-- 装饰性背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 rounded-3xl pointer-events-none"></div>
      
      <!-- 模态框头部 -->
      <div class="relative z-10 flex items-center justify-between p-8 border-b border-slate-200/50 dark:border-slate-700/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ isCreating ? '创建项目' : '编辑项目' }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {{ isCreating ? '添加一个新的项目到作品集' : '更新项目信息' }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-110 shadow-lg border border-slate-200/50 dark:border-slate-600/50"
        >
          <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 模态框内容 -->
      <div class="relative z-10 p-8 space-y-8">
        <!-- 标题和描述 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              项目标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              placeholder="输入项目标题"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              项目状态
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="formData.featured"
                type="checkbox"
                class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
              />
              <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">设为精选项目</span>
            </label>
          </div>
        </div>

        <!-- 描述 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            项目描述 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            required
            class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 resize-none"
            placeholder="简要描述项目的主要功能和特点"
          ></textarea>
        </div>

        <!-- 详细描述 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            详细描述
          </label>
          <textarea
            v-model="formData.longDescription"
            rows="4"
            class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 resize-none"
            placeholder="详细描述项目的技术实现、遇到的挑战和解决方案"
          ></textarea>
        </div>

        <!-- 链接 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
                演示链接
              </div>
            </label>
            <input
              v-model="formData.liveUrl"
              type="url"
              class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
                </svg>
                源码链接
              </div>
            </label>
            <input
              v-model="formData.url"
              type="url"
              class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <!-- 项目图片 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            项目图片
          </label>
          <div class="relative">
            <input
              v-model="formData.image"
              type="url"
              class="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="formData.image" class="mt-4 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-600/50">
              <img :src="formData.image" alt="项目预览" class="w-full h-48 object-cover">
            </div>
          </div>
        </div>

        <!-- 技术栈 -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            技术栈 <span class="text-red-500">*</span>
          </label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(tech, index) in formData.technologies"
              :key="index"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              {{ tech }}
              <button
                @click="removeTechnology(index)"
                class="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTechnology"
              @keypress.enter="addTechnology"
              type="text"
              class="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
              placeholder="输入技术栈名称，按 Enter 添加"
            />
            <button
              @click="addTechnology"
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="relative z-10 flex justify-end items-center gap-3 p-8 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
          @click="$emit('close')"
          class="px-8 py-3 text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200/50 dark:border-slate-600/50 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          取消
        </button>
        <button
          @click="handleSave"
          :disabled="!isFormValid"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ isCreating ? '创建项目' : '保存修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ProjectQueryVO, ProjectCreateDTO, ProjectEditDTO } from "@/types"

interface Props {
  project?: ProjectQueryVO | null
  isCreating?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: ProjectCreateDTO | ProjectEditDTO): void
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  isCreating: false
})

const emit = defineEmits<Emits>()

const formData = ref({
  title: '',
  description: '',
  longDescription: '',
  image: '',
  url: '',
  liveUrl: '',
  technologies: [] as string[],
  featured: false
})

const newTechnology = ref('')

const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' &&
         formData.value.description.trim() !== '' &&
         formData.value.technologies.length > 0
})

const addTechnology = () => {
  const tech = newTechnology.value.trim()
  if (tech && !formData.value.technologies.includes(tech)) {
    formData.value.technologies.push(tech)
    newTechnology.value = ''
  }
}

const removeTechnology = (index: number) => {
  formData.value.technologies.splice(index, 1)
}

const handleSave = () => {
  if (isFormValid.value) {
    const data = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      longDescription: formData.value.longDescription.trim(),
      image: formData.value.image.trim(),
      url: formData.value.url.trim(),
      liveUrl: formData.value.liveUrl.trim(),
      technologies: formData.value.technologies,
      featured: formData.value.featured
    }
    
    emit('save', data)
  }
}

onMounted(() => {
  if (props.project) {
    formData.value = {
      title: props.project.title,
      description: props.project.description,
      longDescription: props.project.longDescription || '',
      image: props.project.image || '',
      url: props.project.url || '',
      liveUrl: props.project.liveUrl || '',
      technologies: [...props.project.technologies],
      featured: props.project.featured || false
    }
  }
})
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