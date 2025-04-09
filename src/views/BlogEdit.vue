<script setup lang="ts">
import { useArticleForm } from '@/composables/useArticleForm';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getArticleInfo } from '@/api/articleController';
import message from "@/utils/message";
import { UploadOutlined } from '@ant-design/icons-vue';
import MarkdownEditor from '@/components/MarkdownEdit.vue';
import { useTheme } from '@/utils/theme'

// 获取路由参数
const route = useRoute();
const articleId = route.query.id ? route.query.id : undefined;
const categoryName = route.query.categoryName as string;
const tagNames = route.query.tagNames ? (route.query.tagNames as string).split(',') : [];
const isLoading = ref(false);

const { currentTheme } = useTheme();

console.log(currentTheme.value)

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
  coverUrl,

  // 分类相关
  categories,
  newCategoryName,
  showCategoryForm,
  isLoadingCategories,
  isAddingCategory,
  addNewCategory,
  deleteCategoryFunction,

  // 标签相关
  tags,
  newTagName,
  showTagForm,
  isLoadingTags,
  isAddingTag,
  addNewTag,
  deleteTagFunction,

  // 图片上传相关
  isUploading,
  handleImageUpload,
  handleUploadImage2,
  removeCoverImage,
  pictureList,
  isPictureModalVisible,
  isFetchingPictures,
  showPictureModal,
  selectPicture,


  // UI状态
  contentExpanded,
  formVisible,
  activeSection,
  animations,

  // 操作状态
  isLoading: isSubmitting,
  isGenerating,

  // 方法
  handleGenerateContent,
  handleSubmit,
  handleCancel,
  // 初始化文章数据方法
  initArticleData
} = useArticleForm();

// 从API获取文章详情
const fetchArticleDetail = async (id: number) => {
  isLoading.value = true;
  try {
    const res = await getArticleInfo({ id: id.toString() });
    if (res.data?.code === 0 && res.data?.data) {
      const article = res.data.data;

      // 处理标签ID和标签名称
      let tagIdsArray: number[] = [];
      let tagNamesArray: string[] = [];

      if (article.tagMap) {
        const tagEntries = Object.entries(article.tagMap);
        tagIdsArray = tagEntries.map(([id]) => Number(id));
        tagNamesArray = tagEntries.map(([, name]) => name as string);
      }

      // 初始化表单数据
      initArticleData(id, {
        title: article.title,
        content: article.content,
        summary: article.summary,
        categoryId: article.categoryId,
        categoryName: article.categoryName,
        tagIds: tagIdsArray,
        tagNames: tagNamesArray,
        status: article.status,
        coverUrl: article.cover,
      });
    }
  } catch (error) {
    console.error("获取文章详情失败:", error);
    message.error("获取文章详情失败");
  } finally {
    isLoading.value = false;
  }
};

// 如果存在文章ID，则获取文章详情
onMounted(() => {
  if (articleId) {
    fetchArticleDetail(articleId);
  }
});
</script>

<template>
  <div class="blog-edit-container">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载文章中...</span>
    </div>
    <div v-else class="form-container"
      :class="{ 'scale-100 opacity-100': formVisible, 'scale-95 opacity-0': !formVisible }">
      <h1 class="form-title">
        <span class="title-text"
          :class="{ 'translate-x-0 opacity-100': formVisible, '-translate-x-full opacity-0': !formVisible }">
          {{ articleId ? '编辑博客' : '新建博客' }}
        </span>
        <div class="title-divider" :class="{ 'scale-x-100': formVisible, 'scale-x-0': !formVisible }"></div>
      </h1>

      <div class="form-content">
        <!-- 封面图片上传 -->
        <div class="form-section"
          :class="{ 'translate-y-0 opacity-100': animations.title, 'translate-y-4 opacity-0': !animations.title }"
          @mouseenter="activeSection = 'cover'" @mouseleave="activeSection = ''">
          <label class="section-label" :class="{ 'active-label': activeSection === 'cover' }">
            博客封面
          </label>

          <div class="cover-upload-container">
            <div v-if="coverUrl" class="cover-image-container">
              <img :src="coverUrl" alt="封面图片" class="cover-image" />
              <div class="cover-image-overlay">
                <button @click="removeCoverImage" class="cover-remove-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="!coverUrl" class="cover-upload-placeholder">
              <button type="button" @click="showPictureModal" class="cover-upload-button">
                <div class="cover-upload-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" class="cover-upload-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="cover-upload-text">点击选择封面图片</p>
                </div>
              </button>
            </div>
          </div>

          <!-- 添加图片选择模态窗口 -->
          <a-modal v-model:visible="isPictureModalVisible" :title="coverUrl === '' ? '插入图片' : '选择封面图片'" width="800px"
            :footer="null">
            <div v-if="isFetchingPictures" class="loading-container">
              <a-spin size="large" />
            </div>
            <div v-else class="picture-grid">
              <div v-for="picture in pictureList" :key="picture.id" class="picture-item"
                @click="selectPicture(picture.url)">
                <img :src="picture.url" :alt="picture.name" class="picture-thumbnail" />
                <div class="picture-name">{{ picture.name }}</div>
              </div>
            </div>
            <div class="upload-section">
              <a-upload :customRequest="handleImageUpload" :showUploadList="false" accept="image/*"
                :disabled="isUploading">
                <a-button type="primary" :loading="isUploading">
                  <upload-outlined />
                  上传新图片
                </a-button>
              </a-upload>
            </div>
          </a-modal>

          <div v-if="isUploading" class="uploading-indicator">
            <svg class="uploading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            上传中...
          </div>
        </div>
      </div>

      <div class="form-section"
        :class="{ 'translate-y-0 opacity-100': animations.title, 'translate-y-4 opacity-0': !animations.title }"
        @mouseenter="activeSection = 'title'" @mouseleave="activeSection = ''">
        <label for="title" class="section-label" :class="{ 'active-label': activeSection === 'title' }">
          标题
        </label>
        <input id="title" type="text" v-model="title" class="form-input"
          :class="{ 'active-input': activeSection === 'title' }" placeholder="请输入博客标题" />
      </div>

      <div class="form-section"
        :class="{ 'translate-y-0 opacity-100': animations.summary, 'translate-y-4 opacity-0': !animations.summary }"
        @mouseenter="activeSection = 'summary'" @mouseleave="activeSection = ''">
        <label for="summary" class="section-label" :class="{ 'active-label': activeSection === 'summary' }">
          摘要
        </label>
        <textarea id="summary" v-model="summary" rows="3" class="form-textarea"
          :class="{ 'active-input': activeSection === 'summary' }" placeholder="请输入博客摘要"></textarea>
      </div>

      <div class="form-grid">
        <div class="form-section"
          :class="{ 'translate-y-0 opacity-100': animations.category, 'translate-y-4 opacity-0': !animations.category }"
          @mouseenter="activeSection = 'category'" @mouseleave="activeSection = ''">
          <div class="section-header">
            <label for="category" class="section-label" :class="{ 'active-label': activeSection === 'category' }">
              分类
            </label>
            <button type="button" class="add-button blue-button" @click="showCategoryForm = !showCategoryForm">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              新增分类
            </button>
          </div>

          <!-- 新增分类表单 -->
          <div v-if="showCategoryForm" class="add-form-container blue-form">
            <div class="add-form-content">
              <input type="text" v-model="newCategoryName" placeholder="输入新分类名称" class="add-form-input" />
              <button type="button" :disabled="isAddingCategory || !newCategoryName.trim()"
                class="add-form-submit blue-submit" @click="addNewCategory">
                <span v-if="isAddingCategory">添加中...</span>
                <span v-else>添加</span>
              </button>
            </div>
          </div>

          <!-- 分类选择 -->
          <a-select id="category" v-model:value="categoryId" :loading="isLoadingCategories" show-search
            placeholder="请选择或搜索分类" :filter-option="filterOption" class="w-full transition-all duration-300"
            :class="{ 'ant-select-focused': activeSection === 'category' }">
            <a-select-option v-if="categoryId && categoryName && !categories.some(c => c.id === categoryId)"
              :key="categoryId" :value="categoryId" :label="categoryName">
              <div class="select-option">
                <span>{{ categoryName }}</span>
              </div>
            </a-select-option>
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id"
              :label="category.name">
              <div class="select-option">
                <span>{{ category.name }}</span>
                <button @click.stop="deleteCategoryFunction(category.id)" class="delete-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </a-select-option>
          </a-select>
          <div v-if="isLoadingCategories" class="loading-indicator">加载分类中...</div>
        </div>

        <div class="form-section"
          :class="{ 'translate-y-0 opacity-100': animations.tags, 'translate-y-4 opacity-0': !animations.tags }"
          @mouseenter="activeSection = 'tags'" @mouseleave="activeSection = ''">
          <div class="section-header">
            <label class="section-label" :class="{ 'active-label': activeSection === 'tags' }">
              标签
            </label>
            <button type="button" class="add-button green-button" @click="showTagForm = !showTagForm">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              新增标签
            </button>
          </div>

          <!-- 新增标签表单 -->
          <div v-if="showTagForm" class="add-form-container green-form">
            <div class="add-form-content">
              <input type="text" v-model="newTagName" placeholder="输入新标签名称" class="add-form-input" />
              <button type="button" :disabled="isAddingTag || !newTagName.trim()" class="add-form-submit green-submit"
                @click="addNewTag">
                <span v-if="isAddingTag">添加中...</span>
                <span v-else>添加</span>
              </button>
            </div>
          </div>

          <div class="tags-container">
            <div v-if="isLoadingTags" class="loading-indicator">加载标签中...</div>

            <!-- 标签选择 -->
            <a-select v-model:value="tagIds" mode="multiple" :loading="isLoadingTags" show-search placeholder="请选择或搜索标签"
              :filter-option="filterOption" class="w-full transition-all duration-300"
              :class="{ 'ant-select-focused': activeSection === 'tags' }" style="min-height: 38px;">
              <template v-for="(tagId, index) in tagIds" :key="`temp-${index}`">
                <a-select-option v-if="tagId && !tags.some(t => t.id === tagId) && tagNames[index]"
                  :key="`temp-${tagId}`" :value="tagId" :label="tagNames[index]">
                  <div class="select-option">
                    <span>{{ tagNames[index] }}</span>
                  </div>
                </a-select-option>
              </template>
              <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id" :label="tag.name">
                <div class="select-option">
                  <span>{{ tag.name }}</span>
                  <button @click.stop="deleteTagFunction(tag.id)" class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>

      <div class="form-section"
        :class="{ 'translate-y-0 opacity-100': animations.status, 'translate-y-4 opacity-0': !animations.status }"
        @mouseenter="activeSection = 'status'" @mouseleave="activeSection = ''">
        <div class="section-header">
          <label class="section-label" :class="{ 'active-label': activeSection === 'status' }">
            发布状态
          </label>
          <button type="button" class="add-button purple-button" @click="contentExpanded = !contentExpanded">
            <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path v-if="contentExpanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 15l7-7 7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            {{ contentExpanded ? '收起' : '展开' }}
          </button>
        </div>
        <div class="status-options">
          <label class="status-option">
            <input type="radio" v-model="status" :value="1" class="status-radio" />
            <span class="status-label">立即发布</span>
          </label>
          <label class="status-option">
            <input type="radio" v-model="status" :value="0" class="status-radio" />
            <span class="status-label">保存为草稿</span>
          </label>
        </div>
        <div class="form-actions" :class="{ 'visible-actions': formVisible, 'hidden-actions': !formVisible }">
      <button type="button" class="cancel-button" @click="handleCancel">
        取消
      </button>
      <button type="button" :disabled="isSubmitting" class="submit-button" @click="handleSubmit">
        <span>{{ isSubmitting ? '提交中...' : '提交博客' }}</span>
      </button>
    </div>
      </div>
    </div>
  </div>
  <div>
    <transition enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-500 ease-in" enter-from-class="opacity-0 max-h-0 overflow-hidden"
      enter-to-class="opacity-100 max-h-[600px] overflow-hidden"
      leave-from-class="opacity-100 max-h-[600px] overflow-hidden" leave-to-class="opacity-0 max-h-0 overflow-hidden">
      <div v-if="contentExpanded">
        <MarkdownEditor v-model="content" :title="title" :is-generating="isGenerating"
          @upload-image="handleUploadImage2" @generate-content="handleGenerateContent"
          :footers="['markdownTotal', '=', 0, 'scrollSwitch']" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* 基础容器样式 */
.blog-edit-container {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  border-radius: 9999px;
  height: 4rem;
  width: 4rem;
  border-bottom-width: 2px;
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}

.loading-text {
  margin-left: 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity));
}

.dark .loading-text {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity));
}

/* 表单容器样式 */
.form-container {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  border-radius: 1.5rem;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  padding: 2rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.dark .form-container {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity));
  --tw-shadow-color: rgb(17 24 39 / 0.4);
  --tw-shadow: var(--tw-shadow-colored);
}

.form-container:hover {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* 标题样式 */
.form-title {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.title-text {
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #2563eb, #9333ea);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.title-divider {
  flex-grow: 1;
  border-bottom-width: 2px;
  margin-left: 1rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 1000ms;
}

.dark .title-divider {
  --tw-border-opacity: 1;
  border-color: rgb(55 65 81 / var(--tw-border-opacity));
}

/* 表单内容区域 */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 表单部分样式 */
.form-section {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.section-label {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

.dark .section-label {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity));
}

.active-label {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity));
}

.dark .active-label {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity));
}

/* 表单输入样式 */
.form-input,
.form-textarea {
  display: block;
  width: 100%;
  border-radius: 0.375rem;
  border-width: 1px;
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  padding: 0.75rem;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.dark .form-input,
.dark .form-textarea {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity));
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.form-input:focus,
.form-textarea:focus {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

.active-input {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity));
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .active-input {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}

.form-textarea {
  min-height: 80px;
}

/* 网格布局 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

/* 部分头部样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* 添加按钮样式 */
.add-button {
  display: inline-flex;
  align-items: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  transform: var(--tw-transform);
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.add-button:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: var(--tw-transform);
}

.button-icon {
  height: 0.75rem;
  width: 0.75rem;
  margin-right: 0.25rem;
}

.blue-button {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity));
}

.dark .blue-button {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity));
  background-color: rgb(30 58 138 / 0.3);
}

.dark .blue-button:hover {
  background-color: rgb(30 64 175 / 0.5);
}

.green-button {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity));
}

.dark .green-button {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity));
  background-color: rgb(5 46 22 / 0.3);
}

.dark .green-button:hover {
  background-color: rgb(21 128 61 / 0.5);
}

.purple-button {
  --tw-text-opacity: 1;
  color: rgb(147 51 234 / var(--tw-text-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(250 245 255 / var(--tw-bg-opacity));
}

.dark .purple-button {
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity));
  background-color: rgb(68 51 122 / 0.3);
}

.dark .purple-button:hover {
  background-color: rgb(107 33 168 / 0.5);
}

/* 添加表单容器 */
.add-form-container {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-width: 1px;
  border-radius: 0.375rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  transform: var(--tw-transform);
}

.blue-form {
  --tw-border-opacity: 1;
  border-color: rgb(219 234 254 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity));
}

.dark .blue-form {
  --tw-border-opacity: 1;
  border-color: rgb(30 58 138 / var(--tw-border-opacity));
  background-color: rgb(30 58 138 / 0.3);
}

.green-form {
  --tw-border-opacity: 1;
  border-color: rgb(220 252 231 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity));
}

.dark .green-form {
  --tw-border-opacity: 1;
  border-color: rgb(5 46 22 / var(--tw-border-opacity));
  background-color: rgb(5 46 22 / 0.3);
}

/* 添加表单内容 */
.add-form-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-form-input {
  display: block;
  flex-grow: 1;
  border-radius: 0.375rem;
  border-width: 1px;
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  padding: 0.5rem;
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
}

.dark .add-form-input {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(229 231 235 / var(--tw-text-opacity));
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity));
}

.add-form-submit {
  display: inline-flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.add-form-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.blue-submit {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}

.blue-submit:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity));
}

.dark .blue-submit {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}

.dark .blue-submit:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity));
}

.green-submit {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}

.green-submit:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity));
}

.dark .green-submit {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}

.dark .green-submit:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity));
}

/* 选择选项样式 */
.select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-button {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}

.delete-button:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity));
}

.delete-icon {
  height: 1rem;
  width: 1rem;
}

/* 加载指示器 */
.loading-indicator {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.dark .loading-indicator {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

/* 状态选项样式 */
.status-options {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-option {
  display: inline-flex;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  transform: var(--tw-transform);
}

.status-option:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: var(--tw-transform);
}

.status-radio {
  height: 1rem;
  width: 1rem;
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity));
}

.status-radio:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

.status-label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
}

.dark .status-label {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity));
}

/* 封面图片上传样式 */
.cover-upload-container {
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cover-image-container {
  position: relative;
  --tw-group-bg-opacity: 0;
}

.cover-image {
  height: 8rem;
  width: 12rem;
  object-fit: cover;
  border-radius: 0.375rem;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
}

.dark .cover-image {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity));
}

.cover-image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgb(0 0 0 / 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  border-radius: 0.375rem;
}

.cover-image-container:hover .cover-image-overlay {
  background-color: rgb(0 0 0 / 0.4);
}

.cover-remove-button {
  opacity: 0;
  padding: 0.5rem;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  border-radius: 9999px;
}

.cover-image-container:hover .cover-remove-button {
  opacity: 1;
}

.cover-remove-button:hover {
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}

.cover-upload-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-style: dashed;
  border-radius: 0.375rem;
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
  height: 8rem;
  width: 12rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.dark .cover-upload-placeholder {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity));
}

.cover-upload-placeholder:hover {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}

.dark .cover-upload-placeholder:hover {
  --tw-border-opacity: 1;
  border-color: rgb(96 165 250 / var(--tw-border-opacity));
}

.cover-upload-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.cover-upload-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1.25rem;
  padding-bottom: 1.5rem;
}

.cover-upload-icon {
  height: 2.5rem;
  width: 2.5rem;
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
  margin-bottom: 0.25rem;
}

.cover-upload-text {
  font-size: 0.75rem;
  line-height: 1rem;
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

.dark .cover-upload-text {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.cover-upload-input {
  display: none;
}

/* 上传指示器 */
.uploading-indicator {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

.dark .uploading-indicator {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity));
}

.uploading-spinner {
  animation: spin 1s linear infinite;
  margin-left: -0.25rem;
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity));
}

/* 标签容器 */
.tags-container {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 编辑器头部 */
.editor-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.ai-generate-button {
  display: inline-flex;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-radius: 0.375rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  background-image: linear-gradient(to right, #6366f1, #8b5cf6);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  transform: var(--tw-transform);
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  overflow: hidden;
}

.dark .ai-generate-button {
  background-image: linear-gradient(to right, #4f46e5, #7c3aed);
}

.ai-generate-button:hover {
  background-image: linear-gradient(to right, #4f46e5, #7c3aed);
  transform: var(--tw-transform);
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .ai-generate-button:hover {
  background-image: linear-gradient(to right, #4338ca, #6d28d9);
}

.ai-generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 700ms;
}

.visible-actions {
  --tw-translate-y: 0;
  opacity: 1;
}

.hidden-actions {
  --tw-translate-y: 2rem;
  opacity: 0;
}

.cancel-button {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity));
  border-radius: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  transform: var(--tw-transform);
}

.dark .cancel-button {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity));
}

.cancel-button:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity));
  transform: var(--tw-transform);
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .cancel-button:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity));
}

.cancel-button:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity));
}

.submit-button {
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-image: linear-gradient(to right, #3b82f6, #2563eb);
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  border-radius: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  overflow: hidden;
  transform: var(--tw-transform);
}

.dark .submit-button {
  background-image: linear-gradient(to right, #1d4ed8, #1e40af);
}

.submit-button:hover {
  background-image: linear-gradient(to right, #2563eb, #1d4ed8);
  transform: var(--tw-transform);
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .submit-button:hover {
  background-image: linear-gradient(to right, #1e40af, #1e3a8a);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-button:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.picture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.picture-item {
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.picture-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.picture-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.picture-name {
  padding: 8px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-section {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.cover-upload-button {
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
</style>