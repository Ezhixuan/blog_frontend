<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import message from '@/utils/message';
import { doSubmitArticle, getArticleCategoryList, getArticleTagList } from '@/api/articleController';
import { mockGenerateBlogContent } from '@/api/ai';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'blogSubmitted'): void
}>();

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

// 当模态框打开时加载分类和标签
onMounted(() => {
  if (props.isOpen) {
    fetchCategories();
    fetchTags();
  }
});

// 监听模态框打开状态
const watchModalOpen = (val: boolean) => {
  if (val) {
    fetchCategories();
    fetchTags();
  }
};

// 通过watch监听isOpen的变化
watch(() => props.isOpen, watchModalOpen);

const closeModal = () => {
  emit('update:isOpen', false);
  // 清空表单
  title.value = '';
  content.value = '';
  summary.value = '';
  categoryId.value = undefined;
  tagIds.value = [];
  status.value = 1;
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
    emit('blogSubmitted');
    closeModal();
  } catch (error: any) {
    message.error(error?.response?.data?.description || '博客提交失败');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                提交博客
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">
                    标题
                  </label>
                  <input
                    id="title"
                    type="text"
                    v-model="title"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="请输入博客标题"
                  />
                </div>

                <div>
                  <label for="summary" class="block text-sm font-medium text-gray-700">
                    摘要
                  </label>
                  <textarea
                    id="summary"
                    v-model="summary"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="请输入博客摘要"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700">
                      分类
                    </label>
                    <select
                      id="category"
                      v-model="categoryId"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option :value="undefined" disabled>请选择分类</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                    <div v-if="isLoadingCategories" class="mt-1 text-xs text-gray-500">加载分类中...</div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      标签
                    </label>
                    <div class="mt-1 space-y-2">
                      <div v-if="isLoadingTags" class="text-xs text-gray-500">加载标签中...</div>
                      <div class="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md max-h-24 overflow-y-auto">
                        <label v-for="tag in tags" :key="tag.id" class="inline-flex items-center">
                          <input
                            type="checkbox"
                            :value="tag.id"
                            v-model="tagIds"
                            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-2 text-sm text-gray-700">{{ tag.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    发布状态
                  </label>
                  <div class="mt-2 flex items-center space-x-4">
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="status" :value="1" class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="ml-2 text-sm text-gray-700">立即发布</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input type="radio" v-model="status" :value="0" class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span class="ml-2 text-sm text-gray-700">保存为草稿</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      内容
                    </label>
                    <button
                      type="button"
                      :disabled="isGenerating || !title"
                      class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      @click="generateContent"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {{ isGenerating ? '生成中...' : 'AI生成内容' }}
                    </button>
                  </div>
                  <v-md-editor
                    v-model="content"
                    height="400px"
                  />
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="closeModal"
                >
                  取消
                </button>
                <button
                  type="button"
                  :disabled="isLoading"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="handleSubmit"
                >
                  {{ isLoading ? '提交中...' : '提交' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style>
.v-md-editor {
  border-radius: 0.375rem;
}
</style>