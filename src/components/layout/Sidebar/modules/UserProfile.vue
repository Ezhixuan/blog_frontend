<template>
  <div class="profile-section">
    <div
      id="avatar-wrapper"
      class="profile-avatar-wrapper"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="relative w-32 h-32 mx-auto mb-4">
        <transition name="avatar-main-fade">
          <img
            :key="userAvatar"
            :src="userAvatar"
            alt="Profile"
            @error="handleAvatarError"
            class="w-full h-full rounded-full border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500 dark:border-gray-700"
          />
        </transition>
        <transition name="avatar-secondary-fade">
          <img
            v-if="isLoggedIn && adminInfo"
            :src="adminInfo.avatar"
            alt="Admin"
            class="absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
          />
        </transition>
      </div>

      <div
        v-if="showLoginDialog && !isLoggedIn"
        class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl p-4 z-10
               animate-fade-in-up border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        @mouseenter="clearHideTimeout"
        @mouseleave="handleDialogLeave"
      >
        <div class="login-dialog-content">
          <p class="login-prompt">登录后体验更多功能</p>
          <button
            @click="handleNavigation('/login')"
            class="login-button primary"
          >
            登录
          </button>
          <button
            @click="handleNavigation('/register')"
            class="login-button secondary"
          >
            注册
          </button>
        </div>
        <div class="dialog-arrow">
          <div class="dialog-arrow-inner"></div>
        </div>
      </div>

      <div
        v-if="showLoginDialog && isLoggedIn"
        class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 backdrop-blur-lg bg-white/90 rounded-lg shadow-2xl p-4 z-10
               animate-float border border-transparent hover:border-blue-300/50 transition-all duration-500
               bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30
               dark:from-gray-900/90 dark:via-gray-900/80 dark:to-blue-900/30 dark:hover:border-blue-500/30"
        @mouseenter="clearHideTimeout"
        @mouseleave="handleDialogLeave"
        style="transform-style: preserve-3d; perspective: 1000px;"
      >
        <div class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="relative group cursor-pointer" @click="triggerAvatarUpload">
              <img 
                :src="userAvatar"
                alt="User Avatar"
                class="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:opacity-80"
                @error="handleAvatarError"
              />
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full">更换头像</div>
              </div>
              <div v-if="isUploadingAvatar" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ userInfo?.username || userInfo?.userAccount || '用户' }}
              </h3>
              <div class="flex items-center justify-center space-x-2 my-1">
                <span 
                  :class="[`text-white text-xs px-2 py-0.5 rounded-full`, getRoleColorClass(userInfo?.role)]"
                >
                  {{ userInfo?.role || '普通用户' }}
                </span>
              </div>
              <p class="text-sm text-gray-500 truncate dark:text-gray-400" :title="userInfo?.email">
                {{ userInfo?.email || '未设置邮箱' }}
              </p>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 border-t border-gray-100 pt-3 dark:text-gray-400 dark:border-gray-700">
            <p class="line-clamp-2" :title="userInfo?.profile">
              {{ userInfo?.profile || '这个人很懒，还没有填写简介' }}
            </p>
          </div>

          <div class="text-xs text-gray-500 border-t border-gray-100 pt-3 dark:text-gray-400 dark:border-gray-700">
            加入时间：{{ userInfo?.createTime ? new Date(userInfo.createTime).toLocaleDateString() : '未知' }}
          </div>
          
          <div class="flex space-x-3 pt-4">
            <button
              @click="userInfo?.role === 'admin' ? router.push('/blog/edit') : emit('openChangePassword')"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:shadow-inner active:translate-y-0.5 transform transition-all duration-200"
            >
              <DocumentPlusIcon v-if="userInfo?.role === 'admin'" class="w-4 h-4" />
              <KeyIcon v-else class="w-4 h-4" />
              {{ userInfo?.role === 'admin' ? '提交博客' : '修改密码' }}
            </button>
            <button
              @click="emit('openEditProfile')"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:shadow-inner active:translate-y-0.5 transform transition-all duration-200"
            >
              <PencilIcon class="w-4 h-4" />
              编辑资料
            </button>
            <button
              @click="handleLogout"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 rounded-xl shadow-md hover:shadow-lg hover:from-gray-300 hover:to-gray-400 active:shadow-inner active:translate-y-0.5 transform transition-all duration-200 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700"
            >
              <ArrowRightOnRectangleIcon class="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>
        
        <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div class="border-8 border-transparent border-b-white dark:border-b-gray-900"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import { PencilIcon, ArrowRightOnRectangleIcon, DocumentPlusIcon, KeyIcon } from '@heroicons/vue/24/outline';
import messageService from '@/utils/helpers/message';
import { logout as doLogout } from '@/api/modules/auth';

// --- Props & Emits ---
const props = defineProps<{
  isLoggedIn: boolean;
  userInfo: any | null;
  adminInfo: any | null;
  isCheckingLogin: boolean;
  isUploadingAvatar: boolean;
}>();

const emit = defineEmits(['checkLoginStatus', 'logout', 'openChangePassword', 'openEditProfile', 'triggerAvatarUpload']);

// --- Composables ---
const router = useRouter();
const route = useRoute();

// --- Refs ---
const showLoginDialog = ref(false);
const hideTimeout = ref<number | null>(null);
const avatarError = ref(false);

// --- Constants ---
const defaultAvatar = "https://avatars.githubusercontent.com/u/46998172?v=4"; // Fallback
const roleColorMap: Record<string, string> = {
  'admin': 'bg-red-500',
  'vip': 'bg-yellow-500',
  'user': 'bg-green-500',
  'default': 'bg-blue-500'
};

// --- Computed ---
const userAvatar = computed(() => {
  if (avatarError.value) {
    return props.adminInfo?.avatar || defaultAvatar;
  }
  if (props.isLoggedIn && props.userInfo?.avatar) {
    return props.userInfo.avatar;
  }
  if (!props.isLoggedIn && props.adminInfo?.avatar) {
    return props.adminInfo.avatar;
  }
  // Fallback for logged-in user without avatar, or if admin info is not available
  return props.userInfo?.avatar || props.adminInfo?.avatar || defaultAvatar;
});

// --- Methods ---
const getRoleColorClass = (role?: string) => {
  if (!role) return roleColorMap.default;
  const lowerRole = role.toLowerCase();
  return roleColorMap[lowerRole] || roleColorMap.default;
};

const handleAvatarError = () => {
  avatarError.value = true;
};

interface RedirectInfo {
  path: string;
  query: Record<string, LocationQueryValue | LocationQueryValue[]>;
  timestamp: number;
  scrollPosition?: number;
}

const handleNavigation = (path: string) => {
  if (path === '/login' || path === '/register') {
    const currentPath = route.path;
    const currentQuery = { ...route.query };
    
    if (currentPath !== '/login' && currentPath !== '/register') {
      const redirectInfo: RedirectInfo = {
        path: currentPath,
        query: currentQuery,
        timestamp: new Date().getTime()
      };
      
      if (currentPath.startsWith('/article/') || currentPath.startsWith('/blog/')) {
        redirectInfo.scrollPosition = window.scrollY;
      }
      
      const redirectPath = `${path}?redirect=${encodeURIComponent(JSON.stringify(redirectInfo))}`;
      
      router.push(redirectPath);
    } else {
      router.push(path);
    }
  } else {
    router.push(path);
  }
  
  showLoginDialog.value = false;
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
};

const handleMouseEnter = () => {
  emit('checkLoginStatus');
  if (!props.isCheckingLogin) {
    if (hideTimeout.value !== null) {
      clearTimeout(hideTimeout.value);
      hideTimeout.value = null;
    }
    showLoginDialog.value = true;
  }
};

const handleMouseLeave = () => {
  hideTimeout.value = setTimeout(() => {
    showLoginDialog.value = false;
    hideTimeout.value = null;
  }, 1500) as unknown as number;
};

const clearHideTimeout = () => {
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
};

const handleDialogLeave = () => {
  hideTimeout.value = setTimeout(() => {
    showLoginDialog.value = false;
    hideTimeout.value = null;
  }, 500) as unknown as number;
};

const handleLogout = async () => {
  try {
    await doLogout();
    messageService.info('退出登录成功, 期待您下次再来');
  } catch (error: any) {
    if (error?.response?.data?.code === 40100) {
      console.log('Token已过期');
    } else {
      messageService.error('退出登录失败');
      return;
    }
  }
  emit('logout');
  showLoginDialog.value = false;
  router.push('/');
};

const triggerAvatarUpload = () => {
  emit('triggerAvatarUpload');
}
</script>

<style scoped>
.profile-section {
  @apply text-center mb-8 relative;
}

.profile-avatar-wrapper {
  @apply relative inline-block;
}

.login-dialog-content {
  @apply text-center space-y-3;
}

.login-prompt {
  @apply text-gray-600 text-sm mb-2 dark:text-gray-300;
}

.login-button {
  @apply w-full px-4 py-2 rounded-lg transition-colors;
}
.login-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.login-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}

.dialog-arrow {
  @apply absolute -top-2 left-1/2 transform -translate-x-1/2;
}
.dialog-arrow-inner {
  @apply border-8 border-transparent border-b-white dark:border-b-gray-800;
}

.dark .dialog-arrow-inner {
  @apply dark:border-b-gray-900;
}

@keyframes float {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.animate-fade-in-up {
  animation: float 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-float {
  animation: float 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Avatar transition styles */
.avatar-main-fade-enter-active,
.avatar-main-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.avatar-main-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.avatar-main-fade-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

.avatar-secondary-fade-enter-active,
.avatar-secondary-fade-leave-active {
  transition: all 0.5s ease;
}
.avatar-secondary-fade-enter-from,
.avatar-secondary-fade-leave-to {
  opacity: 0;
  transform: translate(10px, 10px) scale(0.5);
}
</style>
