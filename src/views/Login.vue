<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { doLogin, getLoginUserInfo } from '@/api/sysUserController';
import { emit } from '@/utils/eventBus';
import messageService from '@/utils/message';

const router = useRouter();
const userAccount = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!userAccount.value || !password.value) {
    messageService.warning('请输入账号和密码');
    return;
  }

  try {
    isLoading.value = true;
    
    const response = await doLogin({
      userAccount: userAccount.value,
      password: password.value
    });
    
    if (response.data.code === 0) {
      // 保存令牌信息到本地存储
      const tokenData = response.data.data as API.TokenInfo;
      if (tokenData && typeof tokenData === 'object') {
        if (tokenData.tokenValue) {
          localStorage.setItem('token', tokenData.tokenValue);
        }
        if (tokenData.tokenName) {
          localStorage.setItem('tokenName', tokenData.tokenName);
        }
        if (tokenData.loginId) {
          localStorage.setItem('loginId', tokenData.loginId);
        }
        if (tokenData.isLogin !== undefined) {
          localStorage.setItem('isLogin', String(tokenData.isLogin));
        }
      }
      
      // 登录成功后获取用户信息
      try {
        const userInfoResponse = await getLoginUserInfo();
        if (userInfoResponse.data?.code === 0 && userInfoResponse.data?.data) {
          // 触发用户信息更新事件
          emit('user-login-success', userInfoResponse.data.data);
          // 显示欢迎信息
          messageService.success(`欢迎回来，${userInfoResponse.data.data.userName || userInfoResponse.data.data.userAccount}！`);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
      
      router.push('/');
    } else {
      messageService.error(response.data.message || '登录失败，请检查账号密码');
    }
  } catch (error) {
    messageService.error('登录失败，请稍后再试');
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">登录您的账号</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          或
          <router-link to="/register" class="font-medium text-primary hover:text-secondary dark:text-primary-light dark:hover:text-secondary-light">
            注册新账号
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="密码"
            />
          </div>
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
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>