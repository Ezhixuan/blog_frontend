<script setup lang="ts">
import { useArticleForm } from '@/composables/useArticleForm';

// 定义类型
interface SelectOption {
  label: string;
  value: any;
  [key: string]: any;
}
// 过滤选项的方法
const filterOption = (input: string, option: SelectOption) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const {
  // 表单数据
  title,
  content,
  summary,
  categoryId,
  tagIds,
  status,
  
  // 分类相关
  categories,
  newCategoryName,
  showCategoryForm,
  isLoadingCategories,
  isAddingCategory,
  addNewCategory,
  
  // 标签相关
  tags,
  newTagName,
  showTagForm,
  isLoadingTags,
  isAddingTag,
  addNewTag,
  
  // UI状态
  contentExpanded,
  formVisible,
  activeSection,
  animations,
  
  // 操作状态
  isLoading,
  isGenerating,
  
  // 方法
  handleGenerateContent,
  handleSubmit,
  handleCancel
} = useArticleForm();
</script>

<template>
  <div class="blog-edit-container max-w-5xl mx-auto py-8 px-4">
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 transform transition-all duration-500 hover:shadow-lg"
      :class="{ 'scale-100 opacity-100': formVisible, 'scale-95 opacity-0': !formVisible }">
      <h1 class="text-3xl font-bold mb-6 flex items-center overflow-hidden">
        <span
          class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 transform transition-all duration-700 ease-out"
          :class="{ 'translate-x-0 opacity-100': formVisible, '-translate-x-full opacity-0': !formVisible }">编辑博客</span>
        <div
          class="flex-grow border-b-2 border-gray-200 dark:border-gray-700 ml-4 transform transition-all duration-1000 ease-out"
          :class="{ 'scale-x-100': formVisible, 'scale-x-0': !formVisible }"></div>
      </h1>

      <div class="space-y-6">
        <div class="transform transition-all duration-500 ease-out"
          :class="{ 'translate-y-0 opacity-100': animations.title, 'translate-y-4 opacity-0': !animations.title }"
          @mouseenter="activeSection = 'title'" @mouseleave="activeSection = ''">
          <label for="title"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-300"
            :class="{ 'text-blue-600 dark:text-blue-400': activeSection === 'title' }">
            标题
          </label>
          <input id="title" type="text" v-model="title"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            :class="{ 'border-blue-300 dark:border-blue-500 shadow-md': activeSection === 'title' }"
            placeholder="请输入博客标题" />
        </div>

        <div class="transform transition-all duration-500 ease-out"
          :class="{ 'translate-y-0 opacity-100': animations.summary, 'translate-y-4 opacity-0': !animations.summary }"
          @mouseenter="activeSection = 'summary'" @mouseleave="activeSection = ''">
          <label for="summary"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-all duration-300"
            :class="{ 'text-blue-600 dark:text-blue-400': activeSection === 'summary' }">
            摘要
          </label>
          <textarea id="summary" v-model="summary" rows="3"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            :class="{ 'border-blue-300 dark:border-blue-500 shadow-md': activeSection === 'summary' }"
            placeholder="请输入博客摘要"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="transform transition-all duration-500 ease-out"
            :class="{ 'translate-y-0 opacity-100': animations.category, 'translate-y-4 opacity-0': !animations.category }"
            @mouseenter="activeSection = 'category'" @mouseleave="activeSection = ''">
            <div class="flex justify-between items-center mb-2">
              <label for="category"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300"
                :class="{ 'text-blue-600 dark:text-blue-400': activeSection === 'category' }">
                分类
              </label>
              <button type="button"
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
                @click="showCategoryForm = !showCategoryForm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                新增分类
              </button>
            </div>

            <!-- 新增分类表单 -->
            <div v-if="showCategoryForm"
              class="mb-2 p-3 border border-blue-100 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/30 transition-all duration-300 transform">
              <div class="flex items-center space-x-2">
                <input type="text" v-model="newCategoryName" placeholder="输入新分类名称"
                  class="block flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
                <button type="button" :disabled="isAddingCategory || !newCategoryName.trim()"
                  class="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  @click="addNewCategory">
                  <span v-if="isAddingCategory">添加中...</span>
                  <span v-else>添加</span>
                </button>
              </div>
            </div>

            <!-- 分类选择 - 使用可搜索的下拉选择框 -->
            <a-select id="category" v-model:value="categoryId" :loading="isLoadingCategories" show-search
              placeholder="请选择或搜索分类"
              :filter-option="filterOption"
              class="w-full transition-all duration-300" :class="{ 'ant-select-focused': activeSection === 'category' }">
              <a-select-option v-for="category in categories" :key="category.id" :value="category.id"
                :label="category.name">
                {{ category.name }}
              </a-select-option>
            </a-select>
            <div v-if="isLoadingCategories" class="mt-1 text-xs text-gray-500 dark:text-gray-400 animate-pulse">加载分类中...
            </div>
          </div>

          <div class="transform transition-all duration-500 ease-out"
            :class="{ 'translate-y-0 opacity-100': animations.tags, 'translate-y-4 opacity-0': !animations.tags }"
            @mouseenter="activeSection = 'tags'" @mouseleave="activeSection = ''">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300"
                :class="{ 'text-blue-600 dark:text-blue-400': activeSection === 'tags' }">
                标签
              </label>
              <button type="button"
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
                @click="showTagForm = !showTagForm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                新增标签
              </button>
            </div>

            <!-- 新增标签表单 -->
            <div v-if="showTagForm"
              class="mb-2 p-3 border border-green-100 dark:border-green-800 rounded-md bg-green-50 dark:bg-green-900/30 transition-all duration-300 transform">
              <div class="flex items-center space-x-2">
                <input type="text" v-model="newTagName" placeholder="输入新标签名称"
                  class="block flex-grow rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
                <button type="button" :disabled="isAddingTag || !newTagName.trim()"
                  class="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  @click="addNewTag">
                  <span v-if="isAddingTag">添加中...</span>
                  <span v-else>添加</span>
                </button>
              </div>
            </div>

            <div class="mt-1 space-y-2">
              <div v-if="isLoadingTags" class="text-xs text-gray-500 dark:text-gray-400 animate-pulse">加载标签中...</div>

              <!-- 标签选择 - 使用可搜索的多选下拉选择框 -->
              <a-select v-model:value="tagIds" mode="multiple" :loading="isLoadingTags" show-search
                placeholder="请选择或搜索标签"
                :filter-option="filterOption"
                class="w-full transition-all duration-300" :class="{ 'ant-select-focused': activeSection === 'tags' }"
                style="min-height: 38px;">
                <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id" :label="tag.name">
                  {{ tag.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <div class="transform transition-all duration-500 ease-out"
          :class="{ 'translate-y-0 opacity-100': animations.status, 'translate-y-4 opacity-0': !animations.status }"
          @mouseenter="activeSection = 'status'" @mouseleave="activeSection = ''">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300"
              :class="{ 'text-blue-600 dark:text-blue-400': activeSection === 'status' }">
              发布状态
            </label>
            <button type="button"
              class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105"
              @click="contentExpanded = !contentExpanded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path v-if="contentExpanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              {{ contentExpanded ? '收起' : '展开' }}
            </button>
          </div>
          <div class="mt-2 flex items-center space-x-4">
            <label class="inline-flex items-center transition-all duration-300 transform hover:scale-105">
              <input type="radio" v-model="status" :value="1"
                class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">立即发布</span>
            </label>
            <label class="inline-flex items-center transition-all duration-300 transform hover:scale-105">
              <input type="radio" v-model="status" :value="0"
                class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">保存为草稿</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-500 ease-in"
      enter-from-class="opacity-0 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 max-h-[600px] overflow-hidden"
      leave-from-class="opacity-100 max-h-[600px] overflow-hidden"
      leave-to-class="opacity-0 max-h-0 overflow-hidden">
      <div v-if="contentExpanded">
        <div class="flex justify-end mb-2">
          <button type="button" 
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-700 dark:hover:from-indigo-500 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleGenerateContent"
            :disabled="isGenerating || !title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ isGenerating ? '生成中...' : 'AI生成内容' }}</span>
          </button>
        </div>
        <v-md-editor 
          v-model="content" 
          height="500px" />
      </div>
    </transition>
    <div class="flex justify-end space-x-4 pt-4 transform transition-all duration-700 ease-out"
      :class="{ 'translate-y-0 opacity-100': formVisible, 'translate-y-8 opacity-0': !formVisible }">
      <button type="button"
        class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105 hover:shadow-md"
        @click="handleCancel">
        取消
      </button>
      <button type="button" :disabled="isLoading"
        class="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-md overflow-hidden"
        @click="handleSubmit">
        <span>{{ isLoading ? '提交中...' : '提交博客' }}</span>
      </button>
    </div>
  </div>
</template>