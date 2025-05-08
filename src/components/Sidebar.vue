<template>
  <aside class="w-72 bg-white shadow-lg p-6 fixed top-0 left-0 bottom-0 overflow-y-auto overflow-hidden z-30 transition-colors duration-300 dark:bg-gray-900 dark:border-r dark:border-gray-800">
    <!-- 添加隐藏的文件上传输入 -->
    <input 
      ref="avatarInputRef"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleAvatarChange"
    />
    
    <transition
      name="sidebar-transition"
      mode="out-in"
    >
      <div class="sidebar-content">
        <div class="profile-section">
          <div
            class="profile-avatar-wrapper"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <!-- 恢复原来的头像样式，移除点击更换功能 -->
            <img
              :src="userAvatar" 
              alt="Profile" 
              @error="handleAvatarError"
              class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500 dark:border-gray-700"
            >

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

            <!-- 用户信息弹窗中的头像 -->
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
                  <div class="relative group cursor-pointer">
                    <img 
                      :src="userAvatar"
                      alt="User Avatar"
                      class="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:opacity-80"
                      @error="handleAvatarError"
                      
                    />
                    <!-- 悬浮提示 -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div class="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded-full" @click="triggerAvatarUpload">更换头像</div>
                    </div>
                    
                    <!-- 上传中状态 -->
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
                <div class="flex space-x-3 pt-4">
                  <button
                    @click="userInfo?.role === 'admin' ? router.push('/blog/edit') : showChangePasswordModal = true"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:shadow-inner active:translate-y-0.5 transform transition-all duration-200"
                  >
                    <DocumentPlusIcon v-if="userInfo?.role === 'admin'" class="w-4 h-4" />
                    <KeyIcon v-else class="w-4 h-4" />
                    {{ userInfo?.role === 'admin' ? '提交博客' : '修改密码' }}
                  </button>
                  <button
                    @click="openEditUserInfoModal"
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
              
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div class="border-8 border-transparent border-b-white dark:border-b-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        <nav class="main-navigation">
          <transition-group name="nav-item">
            <div
              v-for="item in menuItems"
              :key="item.name"
              class="nav-item-container"
            >
              <div
                class="nav-item"
                :class="{
                  active:
                    $route.path === item.link ||
                    (item.hasSubmenu && expandedMenu === item.name),
                }"
                @click="
                  item.hasSubmenu
                    ? toggleSubmenu(item.name)
                    : router.push(item.link)
                "
              >
                <component :is="item.icon" class="nav-item-icon" />
                <span>{{ item.name }}</span>
                <span
                  v-if="item.hasSubmenu"
                  class="nav-submenu-arrow"
                  :class="{ rotated: expandedMenu === item.name }"
                >
                  <svg class="nav-submenu-arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </span>
              </div>

              <div
                v-if="item.name === 'Blogs' && expandedMenu === 'Blogs'"
                class="submenu"
              >
                <div
                  class="submenu-item"
                  :class="{
                    active:
                      $route.path === '/blogs' && !$route.query.categoryId,
                  }"
                  @click="filterByCategory()"
                >
                  <span>全部文章</span>
                </div>

                <div v-if="categoriesLoading" class="submenu-loading">
                  <span class="loading-indicator">
                    <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    加载中...
                  </span>
                </div>

                <div
                  v-for="category in categories"
                  :key="category.id"
                  class="submenu-item"
                  :class="{
                    active: $route.query.categoryId === String(category.id),
                  }"
                  @click="filterByCategory(category.id)"
                >
                  <span>{{ category.name }}</span>
                </div>

                <div v-if="!categoriesLoading && categories.length === 0" class="submenu-empty">
                  暂无分类
                </div>
              </div>
            </div>
          </transition-group>
        </nav>

        <div class="social-links">
          <a href="https://github.com" class="social-link" target="_blank" rel="noopener noreferrer">
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
          </a>
          <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </a>
        </div>

        <div class="theme-toggle-section">
          <button
            @click="toggleTheme"
            class="theme-toggle-btn"
            :class="{ dark: currentTheme === 'dark' }"
          >
            <svg v-show="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="theme-icon sun" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <svg v-show="currentTheme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="theme-icon moon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <span class="theme-toggle-text">
              {{ currentTheme === 'light' ? '亮色模式' : '暗色模式' }}
            </span>
          </button>
        </div>

        <div class="categories-section">
          <h3 class="section-title">Categories</h3>
          <div class="section-content-wrapper">
            <div v-if="categoriesLoading" class="loading-placeholder">
              <span class="loading-indicator">
                <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            </div>

            <span
              v-for="category in categories"
              :key="category.id"
              class="category-tag"
              :class="{ active: $route.query.categoryId === String(category.id) }"
              @click="filterByCategory(category.id)"
            >
              {{ category.name }}
              <span class="category-count">{{ category.count }}</span>
            </span>

            <div v-if="!categoriesLoading && categories.length === 0" class="empty-placeholder">
              暂无分类
            </div>
          </div>
        </div>

        <div class="tags-section">
          <h3 class="section-title">Tags</h3>
          <div class="section-content-wrapper">
            <div v-if="tagsLoading" class="loading-placeholder">
              <span class="loading-indicator">
                <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            </div>

            <span
              v-for="tag in tags"
              :key="tag.id"
              class="tag-item"
              :class="{ active: $route.query.tagId === String(tag.id) }"
              @click="filterByTag(tag.id)"
            >
              {{ tag.name }}
              <span class="tag-count">{{ tag.count }}</span>
            </span>

            <div v-if="!tagsLoading && tags.length === 0" class="empty-placeholder">
              暂无标签
            </div>
          </div>
        </div>
      </div>
    </transition>
  </aside>

  <ChangePasswordModal
    v-model:isOpen="showChangePasswordModal"
    @passwordChanged="checkLoginStatus"
  />

  <SubmitBlogModal
    v-model:isOpen="showSubmitBlogModal"
  />

  <!-- 编辑用户信息模态框 -->
  <div v-if="showEditUserInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div 
      class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all duration-300 ease-out"
      :class="{'scale-100 opacity-100': showEditUserInfoModal, 'scale-95 opacity-0': !showEditUserInfoModal}"
    >
      <!-- 模态框标题 -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">编辑个人资料</h3>
        <button 
          @click="closeEditUserInfoModal"
          class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

      <!-- 编辑表单 -->
      <form @submit.prevent="saveUserInfo">
        <!-- 用户昵称 -->
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

        <!-- 用户邮箱 -->
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

        <!-- 用户简介 -->
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

        <!-- 保存取消按钮 -->
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            type="button"
            @click="closeEditUserInfoModal"
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
import { ref, onMounted, computed } from 'vue';
import ChangePasswordModal from './ChangePasswordModal.vue';
import SubmitBlogModal from './SubmitBlogModal.vue';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, UserGroupIcon, EnvelopeIcon, PencilIcon, ArrowRightOnRectangleIcon, DocumentPlusIcon, KeyIcon } from '@heroicons/vue/24/outline';
import { RouterLink, useRouter, useRoute, LocationQueryValue } from 'vue-router';
import { doLogout, getLoginUserInfo, editUserInfo } from '@/api/sysUserController';
import { on } from '@/utils/eventBus';
import messageService from '@/utils/message';
import { useTheme } from '@/utils/theme';
import { useUserStore } from '@/stores/user';
import { getCategoryCount, getTagCount } from '@/api/articleController';
import { upload } from '@/api/pictureController';

// --- Stores ---
const userStore = useUserStore();

// --- Composables ---
const { currentTheme, toggleTheme } = useTheme();
const router = useRouter();
const route = useRoute();

// --- Refs ---
const isLoggedIn = ref(false);
const showLoginDialog = ref(false);
const isLoading = ref(true);
const hideTimeout = ref<number | null>(null);
const userInfo = ref<any | null>(null);
const avatarError = ref(false);
const showChangePasswordModal = ref(false);
const showSubmitBlogModal = ref(false);
const expandedMenu = ref<string | null>(null);
const categories = ref<any[]>([]);
const categoriesLoading = ref(false);
const tags = ref<any[]>([]);
const tagsLoading = ref(false);

// 编辑用户信息相关
const showEditUserInfoModal = ref(false);
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

// 用户头像更换相关
const avatarInputRef = ref<HTMLInputElement | null>(null);
const isUploadingAvatar = ref(false);

// --- Constants ---
const defaultAvatar = "https://avatars.githubusercontent.com/u/46998172?v=4";
const roleColorMap: Record<string, string> = {
  'admin': 'bg-red-500',
  'vip': 'bg-yellow-500',
  'user': 'bg-green-500',
  'default': 'bg-blue-500'
};

// --- Computed ---
const userAvatar = computed(() => {
  if (!isLoggedIn.value || !userInfo.value?.avatar || avatarError.value) {
    return defaultAvatar;
  }
  return userInfo.value.avatar;
});

// --- Interfaces ---
interface RedirectInfo {
  path: string;
  query: Record<string, LocationQueryValue | LocationQueryValue[]>;
  timestamp: number;
  scrollPosition?: number;
}

// --- Methods ---
const getRoleColorClass = (role?: string) => {
  if (!role) return roleColorMap.default;
  const lowerRole = role.toLowerCase();
  return roleColorMap[lowerRole] || roleColorMap.default;
};

const checkLoginStatus = async () => {
  if (userInfo.value !== null) {
    return;
  }
  try {
    const response = await getLoginUserInfo();
    isLoggedIn.value = response.data?.data != null;
    if (isLoggedIn.value && response.data?.data) {
      userInfo.value = response.data.data;
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

const handleAvatarError = () => {
  avatarError.value = true;
};

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
  checkLoginStatus()
  if (!isLoading.value) {
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
  localStorage.removeItem('token');
  localStorage.removeItem('tokenName');
  localStorage.removeItem('loginId');
  localStorage.removeItem('isLogin');
  isLoggedIn.value = false;
  userInfo.value = null;
  showLoginDialog.value = false;
  
  userStore.logout();
  
  router.push('/');
};

const toggleSubmenu = (menuName: string): void => {
  if (expandedMenu.value === menuName) {
    expandedMenu.value = null;
  } else {
    expandedMenu.value = menuName;
    if (menuName === 'Blogs' && categories.value.length === 0) {
      loadCategories();
    }
  }
};

const loadCategories = async (): Promise<void> => {
  if (categories.value.length > 0 && !categoriesLoading.value) return;

  categoriesLoading.value = true;
  try {
    const res = await getCategoryCount();
    if (res.data?.data) {
      categories.value = res.data.data;
    } else {
       categories.value = [];
       console.warn('获取分类数据为空或接口格式不符');
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    categories.value = [];
    messageService.error('加载分类失败');
  } finally {
    categoriesLoading.value = false;
  }
};

const loadTags = async (): Promise<void> => {
  if (tags.value.length > 0 && !tagsLoading.value) return;

  tagsLoading.value = true;
  try {
    const res = await getTagCount();
    if (res.data?.data) {
      tags.value = res.data.data;
    } else {
        tags.value = [];
        console.warn('获取标签数据为空或接口格式不符');
    }
  } catch (error) {
    console.error('获取标签列表失败:', error);
    tags.value = [];
    messageService.error('加载标签失败');
  } finally {
    tagsLoading.value = false;
  }
};

const filterByCategory = (categoryId?: number): void => {
  const query: Record<string, string> = {};
  if (categoryId !== undefined) {
    query.categoryId = String(categoryId);
  }
  router.push({ path: '/blogs', query });
};

const filterByTag = (tagId?: number): void => {
  const query: Record<string, string> = {};
  if (tagId !== undefined) {
    query.tagId = String(tagId);
  }
  router.push({ path: '/blogs', query });
};

const handleLoginSuccess = (userData: any): void => {
    userInfo.value = userData;
    isLoggedIn.value = true;
    isLoading.value = false;

    const token = localStorage.getItem('token') || '';
    userStore.setUserInfo({
        id: userData.id || 0,
        username: userData.username || userData.userAccount || '',
        avatar: userData.avatar,
        email: userData.email,
        role: userData.role,
    });
    userStore.setToken(token);

    const redirectInfoStr = localStorage.getItem('loginRedirect');
    if (redirectInfoStr) {
      try {
        const redirectInfo = JSON.parse(redirectInfoStr) as RedirectInfo;
        const currentTime = new Date().getTime();
        const redirectTime = redirectInfo.timestamp || 0;
        const thirtyMinutesInMs = 30 * 60 * 1000;

        if (currentTime - redirectTime < thirtyMinutesInMs) {
          router.push({
            path: redirectInfo.path,
            query: redirectInfo.query,
          }).then(() => {
            if (redirectInfo.scrollPosition !== undefined) {
              setTimeout(() => {
                window.scrollTo({
                  top: redirectInfo.scrollPosition,
                  behavior: 'smooth',
                });
              }, 300);
            }
          });
        } else {
          console.log('重定向信息已过期。');
        }
      } catch (e) {
        console.error('解析重定向信息失败:', e);
      } finally {
        localStorage.removeItem('loginRedirect');
      }
    }
};

onMounted(() => {
  checkLoginStatus();
  loadTags();
  loadCategories();

  on('user-login-success', handleLoginSuccess);
});

const menuItems = [
  { name: 'Home', icon: HomeIcon, link: '/', hasSubmenu: false },
  { name: 'About', icon: UserIcon, link: '/about', hasSubmenu: false },
  { name: 'Blogs', icon: DocumentTextIcon, link: '/blogs', hasSubmenu: true },
  { name: 'Project', icon: CodeBracketIcon, link: '/project', hasSubmenu: false },
  { name: 'Friend', icon: UserGroupIcon, link: '/friend', hasSubmenu: false },
  { name: 'Contact', icon: EnvelopeIcon, link: '/contact', hasSubmenu: false },
];

// 打开编辑用户信息模态框
const openEditUserInfoModal = () => {
  // 确保已登录且有用户信息
  if (!isLoggedIn.value || !userInfo.value) {
    messageService.error('获取用户信息失败，请重新登录');
    return;
  }
  
  // 初始化表单数据
  editUserForm.value = {
    username: userInfo.value.username || userInfo.value.userAccount || '',
    email: userInfo.value.email || '',
    profile: userInfo.value.profile || ''
  };
  
  // 清空错误信息
  editUserErrors.value = { username: '', email: '', profile: '' };
  
  // 显示模态框
  showEditUserInfoModal.value = true;
};

// 关闭编辑用户信息模态框
const closeEditUserInfoModal = () => {
  showEditUserInfoModal.value = false;
  editUserErrors.value = { username: '', email: '', profile: '' };
};

// 验证表单数据
const validateUserInfoForm = () => {
  let isValid = true;
  editUserErrors.value = { username: '', email: '', profile: '' };

  // 验证用户名
  if (!editUserForm.value.username.trim()) {
    editUserErrors.value.username = '用户昵称不能为空';
    isValid = false;
  } else if (editUserForm.value.username.length > 20) {
    editUserErrors.value.username = '用户昵称不能超过20个字符';
    isValid = false;
  }

  // 验证邮箱
  if (editUserForm.value.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUserForm.value.email)) {
      editUserErrors.value.email = '请输入有效的邮箱地址';
      isValid = false;
    }
  }

  // 验证简介
  if (editUserForm.value.profile.length > 200) {
    editUserErrors.value.profile = '个人简介不能超过200个字符';
    isValid = false;
  }

  return isValid;
};

// 保存用户信息
const saveUserInfo = async () => {
  if (!validateUserInfoForm()) {
    return;
  }

  isSaving.value = true;
  try {
    // 调用API更新用户信息
    const response = await editUserInfo({
      username: editUserForm.value.username,
      email: editUserForm.value.email,
      profile: editUserForm.value.profile
    });
    
    console.log(response);
    if (response.data?.code === 0 && response.data?.data) {
      // 更新本地用户信息
      userInfo.value = response.data.data;
      
      // 更新全局用户状态
      userStore.setUserInfo({
        id: userInfo.value.id || 0,
        username: userInfo.value.username || '',
        avatar: userInfo.value.avatar,
        email: userInfo.value.email,
        role: userInfo.value.role
      });
      
      // 显示成功消息
      messageService.success('个人资料更新成功');
      
      // 关闭模态框
      closeEditUserInfoModal();
    } else {
      throw new Error(response.data?.message || '更新失败');
    }
  } catch (error: any) {
    console.error('更新用户信息失败:', error);
    messageService.error(error.message || '更新失败，请稍后再试');
  } finally {
    isSaving.value = false;
  }
};

// 触发文件选择
const triggerAvatarUpload = () => {
  // 确保用户已登录
  if (!isLoggedIn.value) {
    messageService.info('请先登录后再更换头像');
    return;
  }
  console.log(avatarInputRef.value);
  
  // 触发点击隐藏的文件输入
  if (avatarInputRef.value) {
    avatarInputRef.value.click();
  }
};

// 处理头像文件选择
const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  
  const file = target.files[0];
  
  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    messageService.error('请上传图片文件 (JPG, PNG, GIF, WEBP)');
    return;
  }
  
  // 验证文件大小 (最大2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    messageService.error('图片大小不能超过2MB');
    return;
  }
  
  try {
    isUploadingAvatar.value = true;
    
    // 第一步：上传图片
    const uploadResponse = await upload({ type: 3 }, file);
    
    if (uploadResponse.data?.code !== 0 || !uploadResponse.data?.data) {
      throw new Error(uploadResponse.data?.message || '头像上传失败');
    }
    
    const avatarUrl = uploadResponse.data.data;
    
    // 第二步：更新用户信息
    const updateResponse = await editUserInfo({
      avatar: avatarUrl
    });
    
    if (updateResponse.data?.code !== 0 || !updateResponse.data?.data) {
      throw new Error(updateResponse.data?.message || '头像更新失败');
    }
    
    // 更新本地用户信息
    userInfo.value = updateResponse.data.data;
    
    // 更新Pinia store中的用户头像
    userStore.setUserInfo({
      id: userInfo.value.id || 0,
      username: userInfo.value.username || userInfo.value.userAccount || '',
      avatar: avatarUrl,
      email: userInfo.value.email,
      role: userInfo.value.role
    });
    
    // 重置头像错误状态
    avatarError.value = false;
    
    // 显示成功消息
    messageService.success('头像更新成功');
  } catch (error: any) {
    console.error('头像更新失败:', error);
    messageService.error(error.message || '头像更新失败，请稍后再试');
  } finally {
    isUploadingAvatar.value = false;
    // 重置文件输入，允许再次上传相同的文件
    if (avatarInputRef.value) {
      avatarInputRef.value.value = '';
    }
  }
};
</script>

<style scoped>
/* --- Base Sidebar --- */
.sidebar-container {
  @apply w-72 bg-white shadow-lg p-6 fixed top-0 left-0 bottom-0 overflow-y-auto overflow-hidden z-30 transition-colors duration-300;
  /* Dark mode styles */
  @apply dark:bg-gray-900 dark:border-r dark:border-gray-800;
}

.sidebar-content {
  @apply flex flex-col;
  min-height: calc(100vh - 3rem); /* 确保内容至少填满视口高度减去padding */
}

/* --- Profile Section --- */
.profile-section {
  @apply text-center mb-8 relative;
}

.profile-avatar-wrapper {
  @apply relative inline-block;
}

.profile-avatar {
  @apply w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500 dark:border-gray-700;
}

/* --- Dialogs (Login & User Welcome) --- */
.login-dialog,
.user-welcome-dialog {
  @apply absolute left-1/2 transform -translate-x-1/2 mt-2 z-10; /* Common positioning */
}

/* Login Dialog Specifics */
.login-dialog {
  @apply w-48 bg-white rounded-lg shadow-xl p-4 border border-gray-200;
  /* Animation */
  @apply animate-fade-in-up;
  /* Dark mode */
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.login-dialog-content {
  @apply text-center space-y-3;
}

.login-prompt {
  @apply text-gray-600 text-sm mb-2;
  /* Dark mode */
  @apply dark:text-gray-300;
}

.login-button {
  @apply w-full px-4 py-2 rounded-lg transition-colors;
}
.login-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.login-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  /* Dark mode */
  @apply dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}

/* User Welcome Dialog Specifics */
.user-welcome-dialog {
  @apply w-72 backdrop-blur-lg bg-white/90 rounded-lg shadow-2xl p-4 border border-transparent transition-all duration-500;
  /* Gradient background */
  @apply bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30;
  /* Hover border */
  @apply hover:border-blue-300/50;
  /* Animation */
  animation: float 0.6s cubic-bezier(0.16, 1, 0.3, 1), glow 3s ease-in-out infinite;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1); /* Base shadow for animation */
  /* Dark mode */
  @apply dark:from-gray-900/90 dark:via-gray-900/80 dark:to-blue-900/30 dark:hover:border-blue-500/30;
}

.user-welcome-content {
  @apply space-y-4;
}

.user-info-basic {
  @apply flex items-start space-x-4;
}

.user-info-avatar {
  @apply w-16 h-16 rounded-full border-2 border-gray-200;
  /* Dark mode */
  @apply dark:border-gray-700;
}

.user-info-details {
  @apply flex-1;
  /* Animation children */
  & > * {
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }
  & h3 { animation-delay: 0.1s; }
  & .user-role-tags { animation-delay: 0.15s; }
  & .user-info-email { animation-delay: 0.2s; }
}

.user-info-name {
  @apply text-lg font-medium text-gray-900;
  /* Dark mode */
  @apply dark:text-white;
}

.user-role-tags {
  @apply flex items-center justify-start space-x-2 my-1; /* Adjusted alignment */
}

.user-role-tag {
  @apply text-white text-xs px-2 py-0.5 rounded-full;
}
/* Role specific colors */
.role-admin { @apply bg-red-500; }
.role-vip { @apply bg-yellow-500; }
.role-user { @apply bg-green-500; }
.role-default { @apply bg-blue-500; }

.user-info-email {
  @apply text-sm text-gray-500 truncate;
  /* Dark mode */
  @apply dark:text-gray-400;
}

.user-profile-section {
  @apply text-sm text-gray-600 border-t border-gray-100 pt-3;
  /* Dark mode */
  @apply dark:text-gray-400 dark:border-gray-700;
  /* Animation */
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  animation-delay: 0.3s;
}

.user-profile-text {
  @apply line-clamp-2; /* Requires @tailwindcss/line-clamp plugin */
}

.user-join-time {
  @apply text-xs text-gray-500 border-t border-gray-100 pt-3;
  /* Dark mode */
  @apply dark:text-gray-400 dark:border-gray-700;
 /* Animation */
 animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
 opacity: 0;
 animation-delay: 0.35s; /* Slightly later than profile */
}


.user-action-buttons {
  @apply flex space-x-2 pt-2;
  /* Animation */
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  animation-delay: 0.4s;
}

.action-button {
  @apply flex-1 px-3 py-2 text-sm rounded-lg transition-colors;
  /* Hover effect from original style block */
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-button:hover {
  transform: translateY(-2px);
}

.action-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.action-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  /* Dark mode */
  @apply dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
}


/* Dialog Arrow */
.dialog-arrow {
  @apply absolute -top-2 left-1/2 transform -translate-x-1/2;
}
.dialog-arrow-inner {
  @apply border-8 border-transparent border-b-white;
}
.dialog-arrow-inner.dark {
  @apply dark:border-b-gray-900; /* Specific dark mode arrow for user dialog */
}
.login-dialog .dialog-arrow-inner {
  @apply dark:border-b-gray-800; /* Specific dark mode arrow for login dialog */
}


/* --- Navigation --- */
.main-navigation {
  @apply space-y-2 mb-8;
}

.nav-item-container {
  /* Base container for transition */
}

.nav-item {
  @apply flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg transition-colors cursor-pointer;
  /* Hover state */
  @apply hover:bg-slate-100;
  /* Dark mode */
  @apply dark:text-gray-300 dark:hover:bg-gray-800;
}
.nav-item.active {
  @apply bg-slate-100 text-blue-600;
  /* Dark mode active */
  @apply dark:bg-gray-800 dark:text-blue-400;
}

.nav-item-icon {
  @apply w-5 h-5;
}

.nav-submenu-arrow {
  @apply ml-auto transform transition-transform duration-300;
}
.nav-submenu-arrow.rotated {
  @apply rotate-180;
}

.nav-submenu-arrow-icon {
  @apply w-4 h-4;
}

/* Submenu */
.submenu {
  @apply pl-9 mt-1 space-y-1 overflow-hidden transition-all duration-300;
}

.submenu-item {
  @apply py-2 px-3 text-sm rounded-md cursor-pointer flex items-center justify-between transition-colors;
  /* Hover state */
  @apply hover:bg-slate-100;
  /* Dark mode */
  @apply dark:text-gray-300 dark:hover:bg-gray-800;
}
.submenu-item.active {
  @apply text-blue-600 font-medium bg-blue-50;
  /* Dark mode active */
  @apply dark:bg-blue-900/20 dark:text-blue-400;
}

.submenu-loading, .submenu-empty {
  @apply py-2 px-3 text-sm text-gray-500 italic;
  /* Dark mode */
  @apply dark:text-gray-300;
}


/* --- Social Links --- */
.social-links {
  @apply flex justify-center space-x-4 mb-8;
  /* Animation */
  @apply animate-fade-slow;
}

.social-link {
  @apply text-gray-600 transition-colors duration-300;
  /* Hover state */
  @apply hover:text-gray-900;
  /* Dark mode */
  @apply dark:text-gray-400 dark:hover:text-white;
}

.social-icon {
  @apply w-6 h-6;
}

/* --- Theme Toggle --- */
.theme-toggle-section {
  @apply mb-8 flex justify-center;
}

.theme-toggle-btn {
  @apply flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 transition-all duration-300;
  /* Hover state */
  @apply hover:bg-slate-100;
  /* Dark mode */
  @apply dark:border-gray-700 dark:hover:bg-gray-800;
}
.theme-toggle-btn.dark { /* Style when dark mode is active */
  @apply bg-blue-50; /* This seems incorrect for dark, likely should be dark specific */
  @apply dark:bg-gray-800; /* Correct dark mode background */
}

.theme-icon {
  @apply h-5 w-5;
}
.theme-icon.sun {
  @apply text-yellow-500;
}
.theme-icon.moon {
  @apply text-blue-300;
}

.theme-toggle-text {
  @apply text-sm font-medium;
  /* Dark mode */
  @apply dark:text-gray-300;
}


/* --- Categories & Tags Sections --- */
.categories-section, .tags-section {
  @apply mb-8 animate-fade-slow;
}
.categories-section { animation-delay: 0.1s; }
.tags-section { animation-delay: 0.2s; }

.section-title {
  @apply text-lg font-semibold mb-4;
  /* Dark mode */
  @apply dark:text-white;
}

.section-content-wrapper {
  @apply flex flex-wrap gap-2;
}

.loading-placeholder, .empty-placeholder {
  @apply text-sm text-gray-500 italic w-full; /* Ensure takes full width if needed */
  /* Dark mode */
  @apply dark:text-gray-300;
}

.loading-indicator {
  @apply flex items-center;
}

.loading-spinner {
  @apply animate-spin h-4 w-4 mr-2 text-blue-600;
  /* Dark mode */
  @apply dark:text-blue-400;
}
.loading-spinner circle { @apply opacity-25; }
.loading-spinner path { @apply opacity-75; }

.category-tag, .tag-item {
  @apply px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center transition-colors duration-300 transform cursor-pointer;
  /* Hover states */
  @apply hover:bg-slate-200 hover:scale-105;
  /* Dark mode */
  @apply dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300;
}
.category-tag.active, .tag-item.active {
  @apply bg-blue-100 text-blue-800;
  /* Dark mode active */
  @apply dark:bg-blue-900 dark:text-blue-300;
}

.category-count, .tag-count {
  @apply ml-2 bg-slate-200 px-2 rounded-full text-xs;
  /* Dark mode */
  @apply dark:bg-gray-700 dark:text-gray-300;
}


/* --- Animations (from original style block) --- */
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
    box-shadow: 0 15px 40px -5px rgba(59, 130, 246, 0.2); /* Blue glow */
  }
}

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

/* Add fade-in animations if not provided by Tailwind */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: float 0.6s cubic-bezier(0.16, 1, 0.3, 1); /* Use float for consistency */
}

.animate-fade-slow {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

/* --- Transitions --- */
/* Sidebar transition */
.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.sidebar-transition-enter-from,
.sidebar-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Nav item transition */
.nav-item-enter-active,
.nav-item-leave-active {
  transition: all 0.3s ease;
}
.nav-item-enter-from,
.nav-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.nav-item-move { /* Add move transition for reordering */
  transition: transform 0.3s ease;
}


</style>