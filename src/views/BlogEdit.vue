<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import message from '@/utils/message';
import { doSubmitArticle, getArticleCategoryList, getArticleTagList, submitCategory, submitTag } from '@/api/generated/api/articleController';
import { mockGenerateBlogContent } from '@/api/ai';

const router = useRouter();
const title = ref('');
const content = ref('');
const summary = ref('');
const categoryId = ref<number | undefined>(undefined);
const tagIds = ref<number[]>([]);
const status = ref(1); // 默认发布状态: 1-发布, 0-草稿
const isLoading = ref(false);
const isGenerating = ref(false);
const categories = ref<API.ArticleCategoryVO[]>([]);
const tags = ref<API.ArticleTagVO[]>([]);
const isLoadingCategories = ref(false);
const isLoadingTags = ref(false);

// 新增相关状态
const newCategoryName = ref('');
const newTagName = ref('');
const isAddingCategory = ref(false);
const isAddingTag = ref(false);
const showCategoryForm = ref(false);
const showTagForm = ref(false);

// 内容区域展开/折叠状态
const contentExpanded = ref(false);

// 动画相关状态
const formVisible = ref(false);
const activeSection = ref('');
const animations = reactive({
  title: false,
  summary: false,
  category: false,
  tags: false,
  status: false,
  content: false
});

// 获取分类列表
const fetchCategories = async () => {
  try {
    isLoadingCategories.value = true;
    const res = await getArticleCategoryList();
    if (res.data?.code === 0 && res.data?.data) {
      categories.value = res.data.data;
    }
  } catch (error: any) {
    message.error(error?.response?.data?.description || '获取分类列表失败');
  } finally {
    isLoadingCategories.value = false;
  }
};

// 添加新分类
const addNewCategory = async () => {
  if (!newCategoryName.value.trim()) {
    message.warning('分类名称不能为空');
    return;
  }

  try {
    isAddingCategory.value = true;
    const res = await submitCategory(newCategoryName.value);
    if (res.data?.code === 0 && res.data?.data) {
      categories.value.push(res.data.data);
      message.success('分类添加成功');
      newCategoryName.value = '';
      showCategoryForm.value = false;
    } else {
      message.error(res.data?.description || '添加分类失败');
    }
  } catch (error: any) {
    message.error(error?.response?.data?.description || '添加分类失败');
  } finally {
    isAddingCategory.value = false;
  }
};

// 获取标签列表
const fetchTags = async () => {
  try {
    isLoadingTags.value = true;
    const res = await getArticleTagList();
    if (res.data?.code === 0 && res.data?.data) {
      tags.value = res.data.data;
    }
  } catch (error: any) {
    message.error(error?.response?.data?.description || '获取标签列表失败');
  } finally {
    isLoadingTags.value = false;
  }
};

// 添加新标签
const addNewTag = async () => {
  if (!newTagName.value.trim()) {
    message.warning('标签名称不能为空');
    return;
  }

  try {
    isAddingTag.value = true;
    const res = await submitTag(newTagName.value);
    if (res.data?.code === 0 && res.data?.data) {
      tags.value.push(res.data.data);
      message.success('标签添加成功');
      newTagName.value = '';
      showTagForm.value = false;
    } else {
      message.error(res.data?.description || '添加标签失败');
    }
  } catch (error: any) {
    message.error(error?.response?.data?.description || '添加标签失败');
  } finally {
    isAddingTag.value = false;
  }
};

// 页面加载时获取分类和标签数据并触发动画
onMounted(() => {
  fetchCategories();
  fetchTags();

  // 页面加载动画
  setTimeout(() => {
    formVisible.value = true;

    // 依次触发各个表单项的动画
    const sections = ['title', 'summary', 'category', 'tags', 'status', 'content'];
    sections.forEach((section, index) => {
      setTimeout(() => {
        animations[section] = true;
      }, index * 150);
    });
  }, 100);
});

const handleCancel = () => {
  router.back();
};

// 使用AI生成博客内容简述
const generateContent = async () => {
  if (!title.value) {
    message.warning('请先填写博客标题');
    return;
  }

  try {
    isGenerating.value = true;
    const response = await mockGenerateBlogContent(title.value);
    if (response.data.code === 0) {
      content.value = response.data.data;
      message.success('内容生成成功，请根据需要修改完善');
    } else {
      message.error(response.data.description || 'AI生成内容失败');
    }
  } catch (error: any) {
    message.error(error?.response?.data?.description || 'AI生成内容失败');
  } finally {
    isGenerating.value = false;
  }
};

const handleSubmit = async () => {
  if (!title.value || !content.value) {
    message.warning('请填写完整信息');
    return;
  }

  if (!categoryId.value) {
    message.warning('请选择博客分类');
    return;
  }

  try {
    isLoading.value = true;
    await doSubmitArticle({
      title: title.value,
      content: content.value,
      summary: summary.value,
      categoryId: categoryId.value,
      tagIds: tagIds.value.join(','),
      status: status.value
    });
    message.success('博客提交成功');
    router.push('/blogs');
  } catch (error: any) {
    message.error(error?.response?.data?.description || '博客提交失败');
  } finally {
    isLoading.value = false;
  }
};
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
              :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
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
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
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
            @click="generateContent"
            :disabled="isGenerating || !title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" </svg>
            <span>{{ isGenerating ? '生成中...' : 'AI生成内容' }}</span>
          </button>
        </div>
          <v-md-editor v-model="content" height="500px" />
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
        <span class="relative z-10">{{ isLoading ? '提交中...' : '提交' }}</span>
        <span v-if="isLoading" class="absolute bottom-0 left-0 h-1 bg-white animate-loading-bar"></span>
      </button>
    </div>
  </div>
</template>

<style>
.v-md-editor {
  border-radius: 0.375rem;
}

/* 添加暗黑模式的编辑器样式覆盖 */
.dark .v-md-editor {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
  border-color: #374151 !important;
}

.dark .v-md-editor .v-md-editor__toolbar {
  background-color: #111827 !important;
  border-bottom-color: #374151 !important;
}

.dark .v-md-editor .v-md-editor__toolbar .v-md-editor__toolbar-item {
  color: #9ca3af !important;
}

.dark .v-md-editor .v-md-editor__toolbar .v-md-editor__toolbar-item:hover {
  color: #e5e7eb !important;
}

.dark .v-md-editor .v-md-editor__toolbar .v-md-editor__toolbar-item.active {
  color: #60a5fa !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper textarea {
  color: #e5e7eb !important;
}

/* 特别针对内容区域白色背景的修复 */
.dark .v-md-editor .auto-textarea {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .auto-textarea__inner {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

.dark .v-md-editor .v-md-editor__area {
  background-color: #1f2937 !important;
}

/* 修复全屏按钮 */
.dark .v-md-editor .v-md-editor__toolbar-item .v-md-editor__toolbar-item--fullscreen {
  color: #9ca3af !important;
}

.dark .v-md-editor .v-md-editor__toolbar-item .v-md-editor__toolbar-item--fullscreen:hover {
  color: #e5e7eb !important;
}

/* 修复全屏模式 */
.dark .v-md-editor.fullscreen {
  background-color: #1f2937 !important;
  z-index: 1300 !important;
}

/* 针对屏幕截图中的特定DOM结构 */
.dark .v-md-editor .v-md-editor__left-area {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-editor__right-area {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-editor__main {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .scrollbar {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .scrollbar__wrap {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .scrollbar__view {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-textarea-editor {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-textarea-editor pre {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

.dark .v-md-editor .v-md-textarea-editor textarea {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
  caret-color: #e5e7eb !important;
}

/* 滚动条样式 */
.dark .v-md-editor .scrollbar__bar {
  background-color: #374151 !important;
}

.dark .v-md-editor .scrollbar__bar.is-horizontal {
  background-color: #374151 !important;
}

.dark .v-md-editor .scrollbar__bar.is-vertical {
  background-color: #374151 !important;
}

.dark .v-md-editor .scrollbar__thumb {
  background-color: #6b7280 !important;
}

/* 为Ant Design组件添加暗黑模式样式 */
.dark .ant-select:not(.ant-select-customize-input) .ant-select-selector {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  color: #e5e7eb !important;
}

.dark .ant-select-dropdown {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

.dark .ant-select-item {
  color: #e5e7eb !important;
}

.dark .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
  background-color: #374151 !important;
}

.dark .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background-color: #4b5563 !important;
}

.dark .ant-select-selection-placeholder {
  color: #9ca3af !important;
}

.dark .ant-select-arrow {
  color: #9ca3af !important;
}

.dark .ant-select-clear {
  background-color: #374151 !important;
  color: #9ca3af !important;
}

.dark .ant-select-multiple .ant-select-selection-item {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
  color: #e5e7eb !important;
}

/* 加强markdown编辑器暗黑模式效果 */
.dark .v-md-editor .v-md-editor__editor-wrapper .CodeMirror {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper .CodeMirror-gutters {
  background-color: #111827 !important;
  border-right-color: #374151 !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper .CodeMirror-cursor {
  border-left-color: #e5e7eb !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper .CodeMirror-selected {
  background-color: rgba(101, 116, 139, 0.3) !important;
}

.dark .v-md-editor .v-md-editor__preview {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

/* 确保所有弹出菜单也使用暗色主题 */
.dark .ant-dropdown-menu {
  background-color: #1f2937 !important;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2) !important;
}

.dark .ant-dropdown-menu-item,
.dark .ant-dropdown-menu-submenu-title {
  color: #e5e7eb !important;
}

.dark .ant-dropdown-menu-item:hover,
.dark .ant-dropdown-menu-submenu-title:hover {
  background-color: #374151 !important;
}

/* 修复编辑器的内部区域 */
.dark .v-md-editor .v-md-editor__editor-wrapper .CodeMirror-scroll {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .v-md-editor__editor-wrapper .auto-textarea-input {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

/* 直接解决白色文本区域问题 */
.dark .v-md-editor .auto-textarea {
  background-color: #1f2937 !important;
}

.dark .v-md-editor .auto-textarea textarea,
.dark .v-md-editor .auto-textarea-block textarea {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

/* 解决预览区域样式 */
.dark .v-md-editor .v-md-editor__preview-wrapper {
  background-color: #1f2937 !important;
  color: #e5e7eb !important;
}

/* 修复编辑器中使用的iframe */
.dark .v-md-editor iframe {
  background-color: #1f2937 !important;
}

@keyframes loading {
  0% {
    width: 0;
  }

  50% {
    width: 100%;
  }

  100% {
    width: 0;
  }
}

.animate-loading-bar {
  animation: loading 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 添加页面过渡动画 */
.scale-95 {
  transform: scale(0.95);
}

.scale-100 {
  transform: scale(1);
}

.scale-105 {
  transform: scale(1.05);
}

.scale-x-0 {
  transform: scaleX(0);
}

.scale-x-100 {
  transform: scaleX(1);
}

.-translate-x-full {
  transform: translateX(-100%);
}

.translate-x-0 {
  transform: translateX(0);
}

.translate-y-4 {
  transform: translateY(1rem);
}

.translate-y-8 {
  transform: translateY(2rem);
}

.translate-y-0 {
  transform: translateY(0);
}
</style>