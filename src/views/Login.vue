<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import { doLogin, getLoginUserInfo } from '@/api/sysUserController';
import { emit } from '@/utils/eventBus';
import messageService from '@/utils/message';

// 定义重定向信息的接口
interface RedirectInfo {
  path: string;
  query: Record<string, LocationQueryValue | LocationQueryValue[]>;
  timestamp: number;
  scrollPosition?: number;
}

const router = useRouter();
const route = useRoute();
const userAccount = ref('');
const password = ref('');
const isLoading = ref(false);
const redirectInfo = ref<RedirectInfo | null>(null);

// 组件加载时获取URL中的重定向信息
onMounted(() => {
  const redirectParam = route.query.redirect;
  if (redirectParam && typeof redirectParam === 'string') {
    try {
      redirectInfo.value = JSON.parse(decodeURIComponent(redirectParam)) as RedirectInfo;
    } catch (e) {
      console.error('解析URL重定向参数失败:', e);
    }
  }
});

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
      const tokenData = response.data.data as API.SaTokenInfo;
      if (tokenData && typeof tokenData === 'object') {
        if (tokenData.tokenValue) {
          localStorage.setItem('token', tokenData.tokenValue.toString());
        }
        if (tokenData.tokenName) {
          localStorage.setItem('tokenName', tokenData.tokenName.toString());
        }
        if (tokenData.loginId) {
          localStorage.setItem('loginId', String(tokenData.loginId));
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
          const userInfo = userInfoResponse.data.data as API.UserInfoVO;
          emit('user-login-success', userInfo);
          // 显示欢迎信息
          messageService.success(`欢迎回来，${userInfo.username || userInfo.userAccount}！`);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
      
      // 处理重定向
      if (redirectInfo.value) {
        try {
          // 检查重定向时间是否在30分钟内
          const currentTime = new Date().getTime();
          const redirectTime = redirectInfo.value.timestamp || 0;
          const thirtyMinutesInMs = 30 * 60 * 1000;
          
          if (currentTime - redirectTime < thirtyMinutesInMs) {
            router.push({
              path: redirectInfo.value.path,
              query: redirectInfo.value.query
            }).then(() => {
              // 如果有滚动位置信息，恢复滚动位置
              if (redirectInfo.value?.scrollPosition) {
                setTimeout(() => {
                  window.scrollTo({
                    top: redirectInfo.value?.scrollPosition || 0,
                    behavior: 'smooth'
                  });
                }, 500);
              }
            }).catch(() => router.push('/'));
            return;
          }
        } catch (e) {
          console.error('处理重定向失败:', e);
        }
      }
      
      // 没有有效的重定向信息，默认跳转到首页
      router.push('/');
    } else {
      const errorMessage = typeof response.data.message === 'string' 
        ? response.data.message 
        : '登录失败，请检查账号密码';
      messageService.error(errorMessage);
    }
  } catch (error) {
    messageService.error('登录失败，请稍后再试');
    console.error('登录失败:', error);
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