<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { doRegister } from '@/api/sysUserController';

const router = useRouter();
const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  if (!userAccount.value || !userPassword.value) {
    errorMessage.value = '请输入账号和密码';
    return;
  }

  if (userPassword.value !== checkPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const response = await doRegister({
      userAccount: userAccount.value,
      password: userPassword.value,
      confirmPassword: checkPassword.value
    });
    
    if (response.data.code === 0) {
      router.push('/login');
    } else {
      errorMessage.value = response.data.message || '注册失败，请稍后再试';
    }
  } catch (error) {
    errorMessage.value = '注册失败，请稍后再试';
    console.error('Register error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">注册新账号</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          或
          <router-link to="/login" class="font-medium text-primary hover:text-secondary dark:text-primary-light dark:hover:text-secondary-light">
            登录已有账号
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="user-account" class="sr-only">账号</label>
            <input
              id="user-account"
              name="account"
              type="text"
              required
              v-model="userAccount"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="账号"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="userPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="密码"
            />
          </div>
          <div>
            <label for="check-password" class="sr-only">确认密码</label>
            <input
              id="check-password"
              name="checkPassword"
              type="password"
              required
              v-model="checkPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="确认密码"
            />
          </div>
        </div>

        <div class="text-red-500 text-sm" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-primary-light group-hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>