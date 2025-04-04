<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ChangePasswordModal from './ChangePasswordModal.vue';
import SubmitBlogModal from './SubmitBlogModal.vue';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import { RouterLink, useRouter } from 'vue-router';
import { doLogout, getLoginUserInfo } from '@/api/sysUserController';
import { on } from '@/utils/eventBus';
import message from '@/utils/message';
import { useTheme } from '@/utils/theme';
import { useUserStore } from '@/stores/user'; // 导入用户状态存储

// 获取用户状态存储
const userStore = useUserStore();

// 获取主题状态
const { currentTheme, toggleTheme } = useTheme();

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
      // 正确格式化参数调用userStore.login
      const token = localStorage.getItem('token') || '';
      userStore.setUserInfo({
        id: userInfo.value.id || 0,
        username: userInfo.value.username || userInfo.value.userAccount || '',
        avatar: userInfo.value.avatar,
        email: userInfo.value.email,
        role: userInfo.value.role
      });
      userStore.setToken(token);
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
  
  // 清除全局用户状态
  userStore.logout();
  
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

onMounted(() => {
  checkLoginStatus();
  loadTags(); // 加载标签列表
  loadCategories(); // 加载分类列表
  
  // 监听登录成功事件，更新用户信息
  on('user-login-success', (userData: API.UserInfoVO) => {
    userInfo.value = userData;
    isLoggedIn.value = true;
    isLoading.value = false;
    
    // 更新全局用户状态
    const token = localStorage.getItem('token') || '';
    userStore.setUserInfo({
      id: userData.id || 0,
      username: userData.username || userData.userAccount || '',
      avatar: userData.avatar,
      email: userData.email,
      role: userData.role
    });
    userStore.setToken(token);
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

// 导入分类和标签API
import { getArticleCategoryList, getArticlePageList, getCategoryCount, getTagCount } from '@/api/articleController';

// 子菜单展开状态
const expandedMenu = ref<string | null>(null);

// 分类数据
const categories = ref<API.ArticleCategoryCountVO[]>([]);
const categoriesLoading = ref(false);

// 切换子菜单展开/折叠状态
const toggleSubmenu = (menuName: string) => {
  if (expandedMenu.value === menuName) {
    expandedMenu.value = null;
  } else {
    expandedMenu.value = menuName;
    // 如果是Blogs菜单，加载分类列表
    if (menuName === 'Blogs') {
      loadCategories();
    }
  }
};

// 加载分类列表
const loadCategories = async () => {
  if (categories.value.length > 0) return; // 已加载过，不重复加载
  
  categoriesLoading.value = true;
  try {
    const res = await getCategoryCount();
    if (res.data?.data) {
      categories.value = res.data.data;
    }
  } catch (error) {
    console.error('获取分类列表失败', error);
  } finally {
    categoriesLoading.value = false;
  }
};

// 按分类筛选文章
const filterByCategory = (categoryId?: number) => {
  // 构建查询参数
  const query: Record<string, string> = {};
  
  // 如果有分类ID，添加到查询参数
  if (categoryId) {
    query.categoryId = String(categoryId);
  }
  
  // 跳转到博客列表页面，带上分类ID参数
  router.push({
    path: '/blogs',
    query
  });
};

// 标签数据
const tags = ref<API.ArticleTagCountVO[]>([]);
const tagsLoading = ref(false);

// 加载标签列表
const loadTags = async () => {
  if (tags.value.length > 0) return; // 已加载过，不重复加载
  
  tagsLoading.value = true;
  try {
    const res = await getTagCount();
    if (res.data?.data) {
      tags.value = res.data.data;
    }
  } catch (error) {
    console.error('获取标签列表失败', error);
  } finally {
    tagsLoading.value = false;
  }
};

// 按标签筛选文章
const filterByTag = (tagId?: number) => {
  // 构建查询参数
  const query: Record<string, string> = {};
  
  // 如果有标签ID，添加到查询参数
  if (tagId) {
    query.tagId = String(tagId);
  }
  
  // 跳转到博客列表页面，带上标签ID参数
  router.push({
    path: '/blogs',
    query
  });
};

</script>

<template>
  <aside class="w-72 bg-white shadow-lg p-6 fixed top-0 left-0 bottom-0 overflow-y-auto overflow-hidden z-30 transition-colors duration-300 dark:bg-gray-900 dark:border-r dark:border-gray-800">
    <!-- 使用transition-group实现平滑过渡 -->
    <transition
      name="sidebar-transition"
      mode="out-in"
    >
      
      <!-- 默认侧边栏 (非文章页面显示) -->
      <div class="sidebar-content">
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
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500 dark:border-gray-700"
            >
            
            <!-- Login Dialog (when not logged in) -->
            <div
              v-if="showLoginDialog && !isLoggedIn"
              class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl p-4 z-10
                     animate-fade-in-up border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              @mouseenter="clearHideTimeout"
              @mouseleave="handleDialogLeave"
            >
              <div class="text-center space-y-3">
                <p class="text-gray-600 text-sm mb-2 dark:text-gray-300">登录后体验更多功能</p>
                <button
                  @click="handleNavigation('/login')"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  登录
                </button>
                <button
                  @click="handleNavigation('/register')"
                  class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  注册
                </button>
              </div>
              
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div class="border-8 border-transparent border-b-white dark:border-b-gray-800"></div>
              </div>
            </div>
            
            <!-- User Welcome Dialog (when logged in) -->
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
                <!-- 用户基本信息 -->
                <div class="flex items-start space-x-4">
                  <img 
                    :src="userAvatar"
                    alt="User Avatar"
                    class="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    @error="handleAvatarError"
                  />
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
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
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400" :title="userInfo?.email">
                      {{ userInfo?.email || '未设置邮箱' }}
                    </p>
                  </div>
                </div>
                
                <!-- 用户简介 -->
                <div class="text-sm text-gray-600 border-t border-gray-100 pt-3 dark:text-gray-400 dark:border-gray-700">
                  <p class="line-clamp-2" :title="userInfo?.profile">
                    {{ userInfo?.profile || '这个人很懒，还没有填写简介' }}
                  </p>
                </div>
    
                <!-- 加入时间 -->
                <div class="text-xs text-gray-500 border-t border-gray-100 pt-3 dark:text-gray-400 dark:border-gray-700">
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
                    class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    退出登录
                  </button>
                </div>
              </div>
              
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div class="border-8 border-transparent border-b-white dark:border-b-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Navigation -->
        <nav class="space-y-2 mb-8">
          <transition-group name="nav-item">
            <div v-for="item in menuItems" :key="item.name" class="nav-item-container">
              <!-- 主菜单项 -->
              <div 
                class="nav-item flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800"
                :class="{ 'bg-slate-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400': $route.path === item.link || (item.hasSubmenu && expandedMenu === item.name) }"
                @click="item.hasSubmenu ? toggleSubmenu(item.name) : router.push(item.link)"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
                <span v-if="item.hasSubmenu" class="ml-auto transform transition-transform duration-300" :class="{ 'rotate-180': expandedMenu === item.name }">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              
              <!-- 子菜单 (仅用于Blogs) -->
              <div 
                v-if="item.name === 'Blogs' && expandedMenu === 'Blogs'"
                class="submenu pl-9 mt-1 space-y-1 overflow-hidden transition-all duration-300"
              >
                <!-- 全部文章选项 -->
                <div 
                  class="submenu-item py-2 px-3 text-sm rounded-md cursor-pointer flex items-center justify-between hover:bg-slate-100 transition-colors dark:hover:bg-gray-800"
                  :class="{ 'text-blue-600 font-medium dark:text-blue-400': $route.path === '/blogs' && !$route.query.categoryId }"
                  @click="filterByCategory()"
                >
                  <span>全部文章</span>
                </div>
                
                <!-- 加载中状态 -->
                <div v-if="categoriesLoading" class="py-2 px-3 text-sm text-gray-500 italic dark:text-gray-400">
                  <span class="flex items-center">
                    <svg class="animate-spin h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    加载中...
                  </span>
                </div>
                
                <!-- 分类列表 -->
                <div 
                  v-for="category in categories" 
                  :key="category.id"
                  class="submenu-item py-2 px-3 text-sm rounded-md cursor-pointer flex items-center justify-between hover:bg-slate-100 transition-colors dark:hover:bg-gray-800"
                  :class="{ 'text-blue-600 font-medium dark:text-blue-400': $route.query.categoryId === String(category.id) }"
                  @click="filterByCategory(category.id)"
                >
                  <span>{{ category.name }}</span>
                </div>
                
                <!-- 无分类提示 -->
                <div v-if="!categoriesLoading && categories.length === 0" class="py-2 px-3 text-sm text-gray-500 italic dark:text-gray-400">
                  暂无分类
                </div>
              </div>
            </div>
          </transition-group>
        </nav>
    
        <!-- Social Links -->
        <div class="flex justify-center space-x-4 mb-8 animate-fade-slow">
          <a href="https://github.com" class="text-gray-600 hover:text-gray-900 transition-colors duration-300 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors duration-300 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>
        
        <!-- Theme Toggle -->
        <div class="mb-8 flex justify-center">
          <button 
            @click="toggleTheme" 
            class="theme-toggle-btn flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-slate-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-all duration-300"
            :class="{'bg-blue-50 dark:bg-gray-800': currentTheme === 'dark'}"
          >
            <!-- 太阳图标 (亮色模式) -->
            <svg 
              v-show="currentTheme === 'light'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-yellow-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            
            <!-- 月亮图标 (暗色模式) -->
            <svg 
              v-show="currentTheme === 'dark'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-blue-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            
            <span class="text-sm font-medium dark:text-gray-300">
              {{ currentTheme === 'light' ? '亮色模式' : '暗色模式' }}
            </span>
          </button>
        </div>
    
        <!-- Categories -->
        <div class="mb-8 animate-fade-slow" style="animation-delay: 0.1s;">
          <h3 class="text-lg font-semibold mb-4 dark:text-white">Categories</h3>
          <div class="flex flex-wrap gap-2">
            <!-- 加载中状态 -->
            <div v-if="categoriesLoading" class="text-sm text-gray-500 italic dark:text-gray-400">
              <span class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            </div>
            
            <!-- 分类列表 -->
            <span v-for="category in categories" 
                  :key="category.id"
                  class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center hover:bg-slate-200 transition-colors duration-300 transform hover:scale-105 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
                  :class="{ 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': $route.query.categoryId === String(category.id) }"
                  @click="filterByCategory(category.id)"
            >
              {{ category.name }}
              <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs dark:bg-gray-700">{{ category.count }}</span>
            </span>
            
            <!-- 无分类提示 -->
            <div v-if="!categoriesLoading && categories.length === 0" class="text-sm text-gray-500 italic dark:text-gray-400">
              暂无分类
            </div>
          </div>
        </div>
    
        <!-- Tags -->
        <div class="animate-fade-slow" style="animation-delay: 0.2s;">
          <h3 class="text-lg font-semibold mb-4 dark:text-white">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <!-- 加载中状态 -->
            <div v-if="tagsLoading" class="text-sm text-gray-500 italic dark:text-gray-400">
              <span class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            </div>
            
            <!-- 标签列表 -->
            <span v-for="tag in tags" 
                  :key="tag.id"
                  class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center hover:bg-slate-200 transition-colors duration-300 transform hover:scale-105 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700"
                  :class="{ 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': $route.query.tagId === String(tag.id) }"
                  @click="filterByTag(tag.id)"
            >
              {{ tag.name }}
              <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs dark:bg-gray-700">{{ tag.count }}</span>
            </span>
            
            <!-- 无标签提示 -->
            <div v-if="!tagsLoading && tags.length === 0" class="text-sm text-gray-500 italic dark:text-gray-400">
              暂无标签
            </div>
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

/* 确保侧边栏内容始终占满高度 */
.sidebar-content {
  min-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
}
</style>