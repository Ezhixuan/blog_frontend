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
      class="bg-white rounded-2xl shadow-md p-8 transform transition-all duration-500 hover:shadow-lg"
      :class="{'scale-100 opacity-100': formVisible, 'scale-95 opacity-0': !formVisible}"
    >
      <h1 class="text-3xl font-bold mb-6 flex items-center overflow-hidden">
        <span 
          class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 transform transition-all duration-700 ease-out"
          :class="{'translate-x-0 opacity-100': formVisible, '-translate-x-full opacity-0': !formVisible}"
        >编辑博客</span>
        <div 
          class="flex-grow border-b-2 border-gray-200 ml-4 transform transition-all duration-1000 ease-out"
          :class="{'scale-x-100': formVisible, 'scale-x-0': !formVisible}"
        ></div>
      </h1>

      <div class="space-y-6">
        <div 
          class="transform transition-all duration-500 ease-out"
          :class="{'translate-y-0 opacity-100': animations.title, 'translate-y-4 opacity-0': !animations.title}"
          @mouseenter="activeSection = 'title'" 
          @mouseleave="activeSection = ''"
        >
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2 transition-all duration-300" :class="{'text-blue-600': activeSection === 'title'}">
            标题
          </label>
          <input
            id="title"
            type="text"
            v-model="title"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all duration-300"
            :class="{'border-blue-300 shadow-md': activeSection === 'title'}"
            placeholder="请输入博客标题"
          />
        </div>

        <div 
          class="transform transition-all duration-500 ease-out"
          :class="{'translate-y-0 opacity-100': animations.summary, 'translate-y-4 opacity-0': !animations.summary}"
          @mouseenter="activeSection = 'summary'" 
          @mouseleave="activeSection = ''"
        >
          <label for="summary" class="block text-sm font-medium text-gray-700 mb-2 transition-all duration-300" :class="{'text-blue-600': activeSection === 'summary'}">
            摘要
          </label>
          <textarea
            id="summary"
            v-model="summary"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all duration-300"
            :class="{'border-blue-300 shadow-md': activeSection === 'summary'}"
            placeholder="请输入博客摘要"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div 
            class="transform transition-all duration-500 ease-out"
            :class="{'translate-y-0 opacity-100': animations.category, 'translate-y-4 opacity-0': !animations.category}"
            @mouseenter="activeSection = 'category'" 
            @mouseleave="activeSection = ''"
          >
            <div class="flex justify-between items-center mb-2">
              <label for="category" class="block text-sm font-medium text-gray-700 transition-all duration-300" :class="{'text-blue-600': activeSection === 'category'}">
                分类
              </label>
              <button
                type="button"
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                @click="showCategoryForm = !showCategoryForm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                新增分类
              </button>
            </div>
            
            <!-- 新增分类表单 -->
            <div v-if="showCategoryForm" class="mb-2 p-3 border border-blue-100 rounded-md bg-blue-50 transition-all duration-300 transform">
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="newCategoryName"
                  placeholder="输入新分类名称"
                  class="block flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  :disabled="isAddingCategory || !newCategoryName.trim()"
                  class="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  @click="addNewCategory"
                >
                  <span v-if="isAddingCategory">添加中...</span>
                  <span v-else>添加</span>
                </button>
              </div>
            </div>
            
            <!-- 分类选择 - 使用可搜索的下拉选择框 -->
            <a-select
              id="category"
              v-model:value="categoryId"
              :loading="isLoadingCategories"
              show-search
              placeholder="请选择或搜索分类"
              :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
              class="w-full transition-all duration-300"
              :class="{'ant-select-focused': activeSection === 'category'}"
            >
              <a-select-option v-for="category in categories" :key="category.id" :value="category.id" :label="category.name">
                {{ category.name }}
              </a-select-option>
            </a-select>
            <div v-if="isLoadingCategories" class="mt-1 text-xs text-gray-500 animate-pulse">加载分类中...</div>
          </div>
          
          <div 
            class="transform transition-all duration-500 ease-out"
            :class="{'translate-y-0 opacity-100': animations.tags, 'translate-y-4 opacity-0': !animations.tags}"
            @mouseenter="activeSection = 'tags'" 
            @mouseleave="activeSection = ''"
          >
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 transition-all duration-300" :class="{'text-blue-600': activeSection === 'tags'}">
                标签
              </label>
              <button
                type="button"
                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                @click="showTagForm = !showTagForm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                新增标签
              </button>
            </div>
            
            <!-- 新增标签表单 -->
            <div v-if="showTagForm" class="mb-2 p-3 border border-green-100 rounded-md bg-green-50 transition-all duration-300 transform">
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="newTagName"
                  placeholder="输入新标签名称"
                  class="block flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  :disabled="isAddingTag || !newTagName.trim()"
                  class="inline-flex items-center px-3 py-2 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  @click="addNewTag"
                >
                  <span v-if="isAddingTag">添加中...</span>
                  <span v-else>添加</span>
                </button>
              </div>
            </div>
            
            <div class="mt-1 space-y-2">
              <div v-if="isLoadingTags" class="text-xs text-gray-500 animate-pulse">加载标签中...</div>
              
              <!-- 标签选择 - 使用可搜索的多选下拉选择框 -->
              <a-select
                v-model:value="tagIds"
                mode="multiple"
                :loading="isLoadingTags"
                show-search
                placeholder="请选择或搜索标签"
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                class="w-full transition-all duration-300"
                :class="{'ant-select-focused': activeSection === 'tags'}"
                style="min-height: 38px;"
              >
                <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id" :label="tag.name">
                  {{ tag.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <div 
          class="transform transition-all duration-500 ease-out"
          :class="{'translate-y-0 opacity-100': animations.status, 'translate-y-4 opacity-0': !animations.status}"
          @mouseenter="activeSection = 'status'" 
          @mouseleave="activeSection = ''"
        >
          <label class="block text-sm font-medium text-gray-700 mb-2 transition-all duration-300" :class="{'text-blue-600': activeSection === 'status'}">
            发布状态
          </label>
          <div class="mt-2 flex items-center space-x-4">
            <label class="inline-flex items-center transition-all duration-300 transform hover:scale-105">
              <input type="radio" v-model="status" :value="1" class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">立即发布</span>
            </label>
            <label class="inline-flex items-center transition-all duration-300 transform hover:scale-105">
              <input type="radio" v-model="status" :value="0" class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">保存为草稿</span>
            </label>
          </div>
        </div>

        <div 
          class="transform transition-all duration-500 ease-out"
          :class="{'translate-y-0 opacity-100': animations.content, 'translate-y-4 opacity-0': !animations.content}"
          @mouseenter="activeSection = 'content'" 
          @mouseleave="activeSection = ''"
        >
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 transition-all duration-300" :class="{'text-blue-600': activeSection === 'content'}">
              内容
            </label>
            <button
              type="button"
              :disabled="isGenerating || !title"
              class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              @click="generateContent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transition-transform duration-500 ease-in-out" :class="{'animate-pulse': isGenerating}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="relative overflow-hidden">
                {{ isGenerating ? '生成中...' : 'AI生成内容' }}
                <span v-if="isGenerating" class="absolute bottom-0 left-0 h-0.5 bg-white animate-loading-bar"></span>
              </span>
            </button>
          </div>
          <div class="transition-all duration-300 rounded-md" :class="{'ring-2 ring-blue-200 shadow-md': activeSection === 'content'}">
            <v-md-editor
              v-model="content"
              height="500px"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-4 transform transition-all duration-700 ease-out" :class="{'translate-y-0 opacity-100': formVisible, 'translate-y-8 opacity-0': !formVisible}">
          <button
            type="button"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 hover:shadow-md"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-md overflow-hidden"
            @click="handleSubmit"
          >
            <span class="relative z-10">{{ isLoading ? '提交中...' : '提交' }}</span>
            <span v-if="isLoading" class="absolute bottom-0 left-0 h-1 bg-white animate-loading-bar"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.v-md-editor {
  border-radius: 0.375rem;
}

@keyframes loading {
  0% { width: 0; }
  50% { width: 100%; }
  100% { width: 0; }
}

.animate-loading-bar {
  animation: loading 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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