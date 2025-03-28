<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ChangePasswordModal from './ChangePasswordModal.vue';
import SubmitBlogModal from './SubmitBlogModal.vue';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import { RouterLink, useRouter } from 'vue-router';
import { doLogout, getLoginUserInfo } from '@/api/generated/api/sysUserController';
import { on } from '@/utils/eventBus';
import message from '@/utils/message';
import { getPageState, clearPageState } from '@/utils/pageMemory';

// 角色颜色映射
const roleColorMap: Record<string, string> = {
  'admin': 'bg-red-500',
  'vip': 'bg-yellow-500',
  'user': 'bg-green-500',
  'default': 'bg-blue-500'
};

// 获取角色对应的颜色类
const getRoleColorClass = (role?: string) => {
  if (!role) return roleColorMap.default;
  const lowerRole = role.toLowerCase();
  return roleColorMap[lowerRole] || roleColorMap.default;
};

const router = useRouter();
const isLoggedIn = ref(false);
const showLoginDialog = ref(false);
const isLoading = ref(true);
const hideTimeout = ref<number | null>(null);
const userInfo = ref<API.UserInfoVO | null>(null);
const avatarError = ref(false);
const showChangePasswordModal = ref(false);
const showSubmitBlogModal = ref(false);

// 文章目录相关状态
const isArticlePage = ref(false);
const articleTitle = ref('');
const articleId = ref<string | null>(null);
const tocItems = ref<any[]>([]);

// 默认头像
const defaultAvatar = "https://avatars.githubusercontent.com/u/46998172?v=4";

// 用户头像
const userAvatar = computed(() => {
  if (!isLoggedIn.value || !userInfo.value?.avatar || avatarError.value) {
    return defaultAvatar;
  }
  return userInfo.value.avatar;
});

// 检查登录状态
const checkLoginStatus = async () => {
  if (userInfo.value !== null) {
    return;
  }
  try {
    const response = await getLoginUserInfo();
    isLoggedIn.value = response.data?.data != null;
    if (isLoggedIn.value && response.data?.data) {
      userInfo.value = response.data.data;
    }
  } catch (error) {
    isLoggedIn.value = false;
    userInfo.value = null;
  } finally {
    isLoading.value = false;
  }
};

// 处理头像加载错误
const handleAvatarError = () => {
  avatarError.value = true;
};

// 处理导航
const handleNavigation = (path: string) => {
  router.push(path);
  showLoginDialog.value = false;
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
};

// 处理鼠标进入头像
const handleMouseEnter = () => {
  checkLoginStatus()
  if (!isLoading.value) {
    // 如果存在延时隐藏，取消它
    if (hideTimeout.value !== null) {
      clearTimeout(hideTimeout.value);
      hideTimeout.value = null;
    }
    showLoginDialog.value = true;
  }
};

// 处理退出登录
const handleLogout = async () => {
  try {
    await doLogout();
    message.info('退出登录成功, 期待您下次再来');
  } catch (error: any) {
    // 如果是token过期，静默处理
    if (error?.response?.data?.code === 40100) {
      console.log('Token已过期');
    } else {
      message.error('退出登录失败');
      return;
    }
  }
  // 无论是否成功都清除本地存储的登录信息
  localStorage.removeItem('token');
  localStorage.removeItem('tokenName');
  localStorage.removeItem('loginId');
  localStorage.removeItem('isLogin');
  isLoggedIn.value = false;
  userInfo.value = null;
  showLoginDialog.value = false;
  router.push('/');
};

// 处理鼠标离开头像
const handleMouseLeave = () => {
  // 设置延时隐藏，1.5秒后隐藏登录框
  hideTimeout.value = setTimeout(() => {
    showLoginDialog.value = false;
    hideTimeout.value = null;
  }, 1500) as unknown as number;
};

// 清除隐藏定时器
const clearHideTimeout = () => {
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
};

// 处理对话框鼠标离开
const handleDialogLeave = () => {
  hideTimeout.value = setTimeout(() => {
    showLoginDialog.value = false;
    hideTimeout.value = null;
  }, 500) as unknown as number;
};

// 处理目录项点击
const handleTocItemClick = (anchor: string) => {
  // 查找元素，支持anchor或id属性
  const element = document.getElementById(anchor);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// 返回文章列表
const backToArticleList = () => {
  const pageState = getPageState();
  
  if (pageState) {
    // 如果有保存的分页状态，使用它返回到指定页
    console.log(`返回到文章列表第${pageState.current}页`);
    router.push({
      path: '/blogs',
      query: {
        page: pageState.current.toString(),
        pageSize: pageState.pageSize.toString()
      }
    });
    
    // 如果记录了滚动位置，在下一个时间循环中恢复滚动位置
    if (pageState.scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: pageState.scrollPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  } else {
    // 如果没有保存的分页状态，直接返回文章列表首页
    console.log('返回到文章列表首页');
    router.push('/blogs');
  }
  
  // 返回后清空分页状态缓存
  clearPageState();
};

onMounted(() => {
  checkLoginStatus();
  
  // 监听登录成功事件，更新用户信息
  on('user-login-success', (userData: API.UserInfoVO) => {
    userInfo.value = userData;
    isLoggedIn.value = true;
    isLoading.value = false;
  });
  
  // 监听进入文章页面事件
  on('enter-article-page', (isEntering: boolean) => {
    console.log('收到文章页面状态变化:', isEntering);
    isArticlePage.value = isEntering;
    if (!isEntering) {
      // 重置文章目录相关状态
      articleTitle.value = '';
      articleId.value = null;
      tocItems.value = [];
    }
  });
  
  // 监听文章目录更新事件
  on('article-toc-updated', (data: { tocItems: any[], title: string, articleId: string }) => {
    console.log('收到文章目录数据:', {
      tocItemsCount: data.tocItems.length,
      title: data.title
    });
    tocItems.value = data.tocItems;
    articleTitle.value = data.title;
    articleId.value = data.articleId;
  });
  
  // 监听目录激活状态更新事件
  on('article-toc-active-updated', (data: { tocItems: any[] }) => {
    // 只更新激活状态，保持目录结构不变
    if (data.tocItems.length === tocItems.value.length) {
      tocItems.value = data.tocItems;
    }
  });
});

const menuItems = [
  { name: 'Home', icon: HomeIcon, link: '/' },
  { name: 'About', icon: UserIcon, link: '/about' },
  { name: 'Blogs', icon: DocumentTextIcon, link: '/blogs', hasSubmenu: true },
  { name: 'Project', icon: CodeBracketIcon, link: '/project' },
  { name: 'Friend', icon: UserGroupIcon, link: '/friend' },
  { name: 'Contact', icon: EnvelopeIcon, link: '/contact' },
];

const categories = [
  { name: 'tech', count: 14 },
  { name: 'project', count: 1 },
  { name: 'todo', count: 1 },
  { name: 'Uncategorized', count: 1 },
  { name: 'life', count: 1 },
];

const tags = [
  { name: 'Frosti', count: 2 },
  { name: 'Blog', count: 2 },
];

</script>

<template>
  <aside class="w-72 bg-white shadow-lg p-6 fixed top-0 left-0 bottom-0 overflow-y-auto z-30">
    <!-- 使用transition-group实现平滑过渡 -->
    <transition
      name="sidebar-transition"
      mode="out-in"
    >
      <!-- 文章侧边栏 (在文章页面显示，无论是否有目录) -->
      <div v-if="isArticlePage" key="article-toc" class="sidebar-content article-toc">
        <div class="toc-header">
          <h2 class="text-xl font-bold mb-2 truncate" :title="articleTitle">{{ articleTitle || '文章' }}</h2>
          <button 
            @click="backToArticleList" 
            class="text-xs text-blue-600 flex items-center hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            返回文章列表
          </button>
        </div>
        
        <!-- 只有当确实有目录项时才显示目录内容 -->
        <div v-if="tocItems.length > 0" class="mt-6 mb-4 border-t border-gray-100 pt-4">
          <h3 class="text-base font-medium mb-3">目录</h3>
          <div class="toc-content space-y-2">
            <transition-group name="toc-item">
              <div 
                v-for="(item, index) in tocItems" 
                :key="item.id || index"
                class="toc-item"
                :style="{ 'padding-left': item.level * 8 + 'px' }"
                :class="{ 'toc-active': item.active }"
                @click="handleTocItemClick(item.anchor || item.id)"
              >
                {{ item.text }}
              </div>
            </transition-group>
          </div>
        </div>
        
        <!-- 无目录提示 -->
        <div v-else class="mt-6 mb-4 border-t border-gray-100 pt-4 text-center text-gray-500 italic">
          <p>该文章没有目录结构</p>
        </div>
      </div>
      
      <!-- 默认侧边栏 (非文章页面显示) -->
      <div v-else key="default-sidebar" class="sidebar-content">
        <!-- Profile -->
        <div class="text-center mb-8 relative">
          <div
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            class="relative inline-block"
          >
            <img
              :src="userAvatar" 
              alt="Profile" 
              @error="handleAvatarError"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500"
            >
            
            <!-- Login Dialog (when not logged in) -->
            <div
              v-if="showLoginDialog && !isLoggedIn"
              class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl p-4 z-10
                     animate-fade-in-up border border-gray-200"
              @mouseenter="clearHideTimeout"
              @mouseleave="handleDialogLeave"
            >
              <div class="text-center space-y-3">
                <p class="text-gray-600 text-sm mb-2">登录后体验更多功能</p>
                <button
                  @click="handleNavigation('/login')"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  登录
                </button>
                <button
                  @click="handleNavigation('/register')"
                  class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  注册
                </button>
              </div>
              
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div class="border-8 border-transparent border-b-white"></div>
              </div>
            </div>
            
            <!-- User Welcome Dialog (when logged in) -->
            <div
              v-if="showLoginDialog && isLoggedIn"
              class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 backdrop-blur-lg bg-white/90 rounded-lg shadow-2xl p-4 z-10
                     animate-float border border-transparent hover:border-blue-300/50 transition-all duration-500
                     bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30"
              @mouseenter="clearHideTimeout"
              @mouseleave="handleDialogLeave"
              style="transform-style: preserve-3d; perspective: 1000px;"
            >
              <div class="space-y-4">
                <!-- 用户基本信息 -->
                <div class="flex items-start space-x-4">
                  <img 
                    :src="userAvatar"
                    alt="User Avatar"
                    class="w-16 h-16 rounded-full border-2 border-gray-200"
                    @error="handleAvatarError"
                  />
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ userInfo?.username || userInfo?.userAccount || '用户' }}
                    </h3>
                    <!-- 角色标签 -->
                    <div class="flex items-center justify-center space-x-2 my-1">
                      <span 
                        :class="[`text-white text-xs px-2 py-0.5 rounded-full`, 
                                getRoleColorClass(userInfo?.role)]"
                      >
                        {{ userInfo?.role || '普通用户' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 truncate" :title="userInfo?.email">
                      {{ userInfo?.email || '未设置邮箱' }}
                    </p>
                  </div>
                </div>
                
                <!-- 用户简介 -->
                <div class="text-sm text-gray-600 border-t border-gray-100 pt-3">
                  <p class="line-clamp-2" :title="userInfo?.profile">
                    {{ userInfo?.profile || '这个人很懒，还没有填写简介' }}
                  </p>
                </div>
    
                <!-- 加入时间 -->
                <div class="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  加入时间：{{ userInfo?.createTime ? new Date(userInfo.createTime).toLocaleDateString() : '未知' }}
                </div>
                
                <!-- 操作按钮 -->
                <div class="flex space-x-2 pt-2">
                  <button
                    @click="userInfo?.role === 'admin' ? router.push('/blog/edit') : showChangePasswordModal = true"
                    class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {{ userInfo?.role === 'admin' ? '提交博客' : '修改密码' }}
                  </button>
                  <button
                    @click="handleLogout"
                    class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
              
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div class="border-8 border-transparent border-b-white"></div>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Navigation -->
        <nav class="space-y-2 mb-8">
          <transition-group name="nav-item">
            <RouterLink v-for="item in menuItems" 
               :key="item.name"
               :to="item.link"
               class="nav-item flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-slate-100 rounded-lg transition-colors"
               active-class="bg-slate-100 text-blue-600"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
              <span v-if="item.hasSubmenu" class="ml-auto">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </RouterLink>
          </transition-group>
        </nav>
    
        <!-- Social Links -->
        <div class="flex justify-center space-x-4 mb-8 animate-fade-slow">
          <a href="https://github.com" class="text-gray-600 hover:text-gray-900 transition-colors duration-300">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors duration-300">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>
    
        <!-- Categories -->
        <div class="mb-8 animate-fade-slow" style="animation-delay: 0.1s;">
          <h3 class="text-lg font-semibold mb-4">Categories</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="category in categories" 
                  :key="category.name"
                  class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center hover:bg-slate-200 transition-colors duration-300 transform hover:scale-105"
            >
              {{ category.name }}
              <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs">{{ category.count }}</span>
            </span>
          </div>
        </div>
    
        <!-- Tags -->
        <div class="animate-fade-slow" style="animation-delay: 0.2s;">
          <h3 class="text-lg font-semibold mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in tags" 
                  :key="tag.name"
                  class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center hover:bg-slate-200 transition-colors duration-300 transform hover:scale-105"
            >
              {{ tag.name }}
              <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs">{{ tag.count }}</span>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </aside>

  <!-- 修改密码模态框 -->
  <ChangePasswordModal
    v-model:isOpen="showChangePasswordModal"
    @passwordChanged="checkLoginStatus"
  />

  <!-- 提交博客模态框 -->
  <SubmitBlogModal
    v-model:isOpen="showSubmitBlogModal"
    @blogSubmitted="checkLoginStatus"
  />
</template>

<style scoped>
.animate-float {
  animation: float 0.6s cubic-bezier(0.16, 1, 0.3, 1), glow 3s ease-in-out infinite;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
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

@keyframes glow {
  0%, 100% {
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 15px 40px -5px rgba(59, 130, 246, 0.2);
  }
}

/* 头像光晕效果 */
img[alt="Profile"] {
  transition: all 0.5s ease;
}

img[alt="Profile"]:hover {
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.3);
  transform: rotate(360deg) scale(1.05);
}

/* 信息浮现动画 */
.flex-1 h3,
.flex-1 .text-sm,
.text-xs,
.flex.space-x-2 {
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.flex-1 h3 { animation-delay: 0.1s; }
.flex-1 .text-sm { animation-delay: 0.2s; }
.text-xs { animation-delay: 0.3s; }
.flex.space-x-2 { animation-delay: 0.4s; }

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬浮效果 */
button {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
}

/* 目录样式 */
.article-toc {
  @apply flex flex-col h-full;
}

.toc-header {
  @apply border-b border-gray-100 pb-4;
}

.toc-content {
  @apply overflow-y-auto max-h-[calc(100vh-200px)];
}

.toc-item {
  @apply text-sm text-gray-600 cursor-pointer transition-colors truncate py-1 hover:text-blue-600;
}

.toc-active {
  @apply text-blue-600 font-medium;
}

/* 侧边栏切换过渡动画 */
.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
  transition: all 0.5s ease;
}

.sidebar-transition-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.sidebar-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 目录项过渡动画 */
.toc-item-enter-active,
.toc-item-leave-active {
  transition: all 0.3s ease;
}

.toc-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toc-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 导航项过渡动画 */
.nav-item-enter-active,
.nav-item-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--i, 0) * 0.05s);
}

.nav-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.nav-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 添加淡入动画样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-slow {
  animation: fadeIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  opacity: 0;
}

/* 确保侧边栏内容始终占满高度 */
.sidebar-content {
  min-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
}
</style>