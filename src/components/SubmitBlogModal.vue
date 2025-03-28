<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import message from '@/utils/message';
import { doSubmitArticle } from '@/api/generated/api/articleController';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'blogSubmitted'): void
}>();

const title = ref('');
const content = ref('');
const isLoading = ref(false);

const closeModal = () => {
  emit('update:isOpen', false);
  // 清空表单
  title.value = '';
  content.value = '';
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    内容
                  </label>
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