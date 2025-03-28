<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import message from '@/utils/message';
import { doSubmitArticle } from '@/api/generated/api/articleController';

const router = useRouter();
const title = ref('');
const content = ref('');
const isLoading = ref(false);

const handleCancel = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!title.value || !content.value) {
    message.warning('请填写完整信息');
    return;
  }

  try {
    isLoading.value = true;
    await doSubmitArticle({
      title: title.value,
      content: content.value
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
    <div class="bg-white rounded-2xl shadow-md p-8 transform transition-all duration-300 hover:shadow-lg">
      <h1 class="text-3xl font-bold mb-6 flex items-center">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">编辑博客</span>
        <div class="flex-grow border-b-2 border-gray-200 ml-4"></div>
      </h1>

      <div class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            标题
          </label>
          <input
            id="title"
            type="text"
            v-model="title"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
            placeholder="请输入博客标题"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            内容
          </label>
          <v-md-editor
            v-model="content"
            height="500px"
          />
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleSubmit"
          >
            {{ isLoading ? '提交中...' : '提交' }}
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
</style>