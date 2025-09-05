<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
    <div 
      class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all duration-300 ease-out"
      :class="{'scale-100 opacity-100': isOpen, 'scale-95 opacity-0': !isOpen}"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">编辑个人资料</h3>
        <button 
          @click="closeModal"
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

      <form @submit.prevent="saveUserInfo">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            用户昵称
          </label>
          <div class="relative">
            <input 
              v-model="editUserForm.username"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="请输入您的昵称"
            />
            <div v-if="editUserErrors.username" class="text-red-500 text-xs mt-1">
              {{ editUserErrors.username }}
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            邮箱地址
          </label>
          <div class="relative">
            <input 
              v-model="editUserForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="请输入您的邮箱"
            />
            <div v-if="editUserErrors.email" class="text-red-500 text-xs mt-1">
              {{ editUserErrors.email }}
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            个人简介
          </label>
          <div class="relative">
            <textarea 
              v-model="editUserForm.profile"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="请简单介绍一下自己"
            ></textarea>
            <div v-if="editUserErrors.profile" class="text-red-500 text-xs mt-1">
              {{ editUserErrors.profile }}
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            </span>
            <span v-else>保存</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { updateUserInfo as editUserInfo } from '@/api/modules/auth';
import messageService from '@/utils/helpers/message';

// --- Props & Emits ---
const props = defineProps<{
  isOpen: boolean;
  userInfo: any | null;
}>();

const emit = defineEmits(['update:isOpen', 'userInfoUpdated']);

// --- Refs ---
const isSaving = ref(false);
const editUserForm = ref({
  username: '',
  email: '',
  profile: '',
});
const editUserErrors = ref({
  username: '',
  email: '',
  profile: '',
});

// --- Watchers ---
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.userInfo) {
    editUserForm.value = {
      username: props.userInfo.username || props.userInfo.userAccount || '',
      email: props.userInfo.email || '',
      profile: props.userInfo.profile || ''
    };
    editUserErrors.value = { username: '', email: '', profile: '' };
  }
});

// --- Methods ---
const closeModal = () => {
  emit('update:isOpen', false);
};

const validateUserInfoForm = () => {
  let isValid = true;
  editUserErrors.value = { username: '', email: '', profile: '' };

  if (!editUserForm.value.username.trim()) {
    editUserErrors.value.username = '用户昵称不能为空';
    isValid = false;
  } else if (editUserForm.value.username.length > 20) {
    editUserErrors.value.username = '用户昵称不能超过20个字符';
    isValid = false;
  }

  if (editUserForm.value.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUserForm.value.email)) {
      editUserErrors.value.email = '请输入有效的邮箱地址';
      isValid = false;
    }
  }

  if (editUserForm.value.profile.length > 200) {
    editUserErrors.value.profile = '个人简介不能超过200个字符';
    isValid = false;
  }

  return isValid;
};

const saveUserInfo = async () => {
  if (!validateUserInfoForm()) {
    return;
  }

  isSaving.value = true;
  try {
    const response = await editUserInfo({
      username: editUserForm.value.username,
      email: editUserForm.value.email,
      profile: editUserForm.value.profile
    });
    
    if (response.code === 0 && response.data) {
      emit('userInfoUpdated', response.data);
      messageService.success('个人资料更新成功');
      closeModal();
    } else {
      throw new Error(response.message || '更新失败');
    }
  } catch (error: any) {
    console.error('更新用户信息失败:', error);
    messageService.error(error.message || '更新失败，请稍后再试');
  } finally {
    isSaving.value = false;
  }
};
</script>
