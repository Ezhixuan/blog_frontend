<template>
  <aside class="w-72 bg-white shadow-lg p-6 fixed top-0 left-0 bottom-0 overflow-y-auto overflow-hidden z-50 transition-all duration-300 dark:bg-gray-900 dark:border-r dark:border-gray-800 -translate-x-full lg:translate-x-0"
         :class="{ 'translate-x-0': isMobileSidebarOpen }"
         @click.stop>

    <transition name="sidebar-transition" mode="out-in">
      <div class="sidebar-content">
        <UserProfile
          :is-logged-in="isLoggedIn"
          :user-info="userInfo"
          :admin-info="adminInfo"
          :is-checking-login="isLoading"
          :is-uploading-avatar="isUploadingAvatar"
          @check-login-status="checkLoginStatus"
          @logout="handleLogout"
          @open-change-password="showChangePasswordModal = true"
          @open-edit-profile="openEditUserInfoModal"
          @trigger-avatar-upload="openPictureSelectModal"
        />

        <!-- Conditional rendering for main content vs. TOC -->
        <div v-if="currentProjectId">
          <ProjectArticleList :articles="projectArticles" :project-id="currentProjectId" />
          <div v-if="shouldShowToc" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <ArticleToc :article-content="articleContent" />
          </div>
        </div>
        <div v-else-if="shouldShowToc">
           <ArticleToc :article-content="articleContent" />
        </div>
        <div v-else>
          <MainMenu />
          <SidebarFooter />
          <TaxonomyList type="categories" />
          <TaxonomyList type="tags" />
        </div>
      </div>
    </transition>
  </aside>

  <!-- Modals -->
  <ChangePasswordModal
    v-model:isOpen="showChangePasswordModal"
    @passwordChanged="checkLoginStatus"
  />
  <EditUserInfoModal
    v-model:isOpen="showEditUserInfoModal"
    :user-info="userInfo"
    @user-info-updated="handleUserInfoUpdate"
  />
  <PictureSelectModal
    v-model:isOpen="showPictureSelectModal"
    @avatar-updated="handleUserInfoUpdate"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useSidebar } from '@/composables/useSidebar';
import { on, off } from '@/utils/helpers/eventBus';
import { getUserInfo as getLoginUserInfo, getAdminInfo } from '@/api/modules/auth';
import { getArticleList } from '@/api/modules/blog';
import type { ArticleInfo } from '@/types';

// Import new modular components
import UserProfile from './modules/UserProfile.vue';
import MainMenu from './modules/MainMenu.vue';
import ArticleToc from './modules/ArticleToc.vue';
import ProjectArticleList from './modules/ProjectArticleList.vue';
import TaxonomyList from './modules/TaxonomyList.vue';
import SidebarFooter from './modules/SidebarFooter.vue';
import EditUserInfoModal from './modules/EditUserInfoModal.vue';
import PictureSelectModal from './modules/PictureSelectModal.vue';
import ChangePasswordModal from '@/components/ui/Modal/ChangePasswordModal.vue';

// --- Stores & Composables ---
const userStore = useUserStore();
const { isMobileSidebarOpen } = useSidebar();
const route = useRoute();

// --- State ---
const isLoggedIn = ref(false);
const isLoading = ref(true);
const userInfo = ref<any | null>(null);
const adminInfo = ref<any | null>(null);
const isUploadingAvatar = ref(false); // This might be better inside PictureSelectModal if not needed elsewhere

// --- Modal Visibility ---
const showChangePasswordModal = ref(false);
const showEditUserInfoModal = ref(false);
const showPictureSelectModal = ref(false);

// --- Article TOC State ---
const articleContent = ref<string>('');
const projectArticles = ref<ArticleInfo[]>([]);
const currentProjectId = ref<string | null>(null);

// --- Computed Properties ---
const isArticleDetailPage = computed(() => {
  return route.path.startsWith('/article/');
});

const shouldShowToc = computed(() => {
  return isArticleDetailPage.value && articleContent.value && articleContent.value.length > 0;
});

// --- Methods ---
const checkLoginStatus = async () => {
  if (userInfo.value !== null) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const response = await getLoginUserInfo();
    isLoggedIn.value = response.data != null;
    if (isLoggedIn.value && response.data) {
      handleUserInfoUpdate(response.data);
    }
  } catch (error) {
    isLoggedIn.value = false;
    userInfo.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handleUserInfoUpdate = (newUserInfo: any) => {
  userInfo.value = newUserInfo;
  const token = localStorage.getItem('token') || '';
  userStore.setUserInfo({
    id: newUserInfo.id || 0,
    username: newUserInfo.username || newUserInfo.userAccount || '',
    avatar: newUserInfo.avatar,
    email: newUserInfo.email,
    role: newUserInfo.role
  });
  userStore.setToken(token);
  isLoggedIn.value = true;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenName');
  localStorage.removeItem('loginId');
  localStorage.removeItem('isLogin');
  isLoggedIn.value = false;
  userInfo.value = null;
  userStore.logout();
};

const fetchProjectArticles = async (projectId: string) => {
  try {
    const response = await getArticleList({
      projectId,
      pageSize: 100,
      current: 1,
      sortOrder: 'desc'
    }); // Fetch all articles for the project
    if (response.data) {
      projectArticles.value = response.data.data;
      currentProjectId.value = projectId;
    }
  } catch (error) {
    console.error('Failed to fetch project articles:', error);
    projectArticles.value = [];
    currentProjectId.value = null;
  }
};

const openEditUserInfoModal = () => {
  showEditUserInfoModal.value = true;
};

const openPictureSelectModal = () => {
  showPictureSelectModal.value = true;
};

// --- EventBus Handlers ---
const handleArticleContentUpdate = (data: { content: string; path: string }) => {
  if (data.path.startsWith('/article/')) {
    articleContent.value = data.content;
  }
};

const handleLoginSuccess = (userData: any) => {
    handleUserInfoUpdate(userData);
};

// --- Methods ---
const fetchAdminInfo = async () => {
  try {
    const response = await getAdminInfo();
    if (response.data) {
      adminInfo.value = response.data;
    }
  } catch (error) {
    console.error('Failed to fetch admin info:', error);
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  checkLoginStatus();
  fetchAdminInfo();
  on('user-login-success', handleLoginSuccess);
  on('article-content-updated', handleArticleContentUpdate);
});

watch(() => route.query.projectId, (newProjectId, oldProjectId) => {
  if (newProjectId && typeof newProjectId === 'string') {
    if (newProjectId !== currentProjectId.value) {
      fetchProjectArticles(newProjectId);
    }
  } else {
    currentProjectId.value = null;
    projectArticles.value = [];
  }
}, { immediate: true });

watch(() => route.path, (newPath) => {
  if (!newPath.startsWith('/article/')) {
    articleContent.value = '';
  }
});

onBeforeUnmount(() => {
  off('user-login-success', handleLoginSuccess);
  off('article-content-updated', handleArticleContentUpdate);
});
</script>

<style scoped>
.sidebar-content {
  @apply flex flex-col;
  min-height: calc(100vh - 3rem);
}

.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.sidebar-transition-enter-from,
.sidebar-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
