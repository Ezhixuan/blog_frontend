<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { editUserInfo } from '@/api/sysUserController';
import message from '@/utils/message';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'passwordChanged'): void
}>();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const closeModal = () => {
  emit('update:isOpen', false);
  // 清空表单
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};

const handleSubmit = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    message.warning('请填写完整信息');
    return;
  }

  if (oldPassword.value === newPassword.value && newPassword.value === confirmPassword.value) {
    message.warning('新密码不能与旧密码相同');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    message.warning('两次输入的新密码不一致');
    return;
  }

  try {
    isLoading.value = true;
    await editUserInfo({
      password: newPassword.value,
      oldPassword: oldPassword.value
    });
    message.success('密码修改成功');
    emit('passwordChanged');
    closeModal();
  } catch (error: any) {
    message.error(error?.response?.data?.description || '密码修改失败');
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                修改密码
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <div>
                  <label for="old-password" class="block text-sm font-medium text-gray-700">
                    旧密码
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="old-password"
                      :type="showOldPassword ? 'text' : 'password'"
                      v-model="oldPassword"
                      class="block w-full rounded-lg border-gray-300 pr-10 py-3 px-4 text-base focus:border-blue-500 focus:ring-blue-500"
                      placeholder="请输入旧密码"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 px-3 flex items-center"
                      @click="showOldPassword = !showOldPassword"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                        <path v-if="!showOldPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path v-if="!showOldPassword" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-if="showOldPassword" stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700">
                    新密码
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="new-password"
                      :type="showNewPassword ? 'text' : 'password'"
                      v-model="newPassword"
                      class="block w-full rounded-lg border-gray-300 pr-10 py-3 px-4 text-base focus:border-blue-500 focus:ring-blue-500"
                      placeholder="请输入新密码"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 px-3 flex items-center"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                        <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path v-if="!showNewPassword" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-if="showNewPassword" stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">
                    确认新密码
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="confirm-password"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="confirmPassword"
                      class="block w-full rounded-lg border-gray-300 pr-10 py-3 px-4 text-base focus:border-blue-500 focus:ring-blue-500"
                      placeholder="请再次输入新密码"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 px-3 flex items-center"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                        <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </button>
                  </div>
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
                  {{ isLoading ? '提交中...' : '确认修改' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>