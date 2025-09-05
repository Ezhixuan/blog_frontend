<template>
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
          @click="handleNavClick(item)"
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, UserGroupIcon, EnvelopeIcon, BookOpenIcon, WifiIcon } from '@heroicons/vue/24/outline';
import { getCategoryList, getCategoryCount } from '@/api/modules/blog';
import messageService from '@/utils/helpers/message';
import { useSidebar } from '@/composables/useSidebar';

// --- Composables ---
const router = useRouter();
const { closeMobileSidebar } = useSidebar();

// --- Refs ---
const expandedMenu = ref<string | null>(null);
const categories = ref<any[]>([]);
const categoriesLoading = ref(false);

// --- Computed ---
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 1024; // lg breakpoint
  }
  return false;
});

// --- Menu ---
const menuItems = [
  { name: 'Home', icon: HomeIcon, link: '/', hasSubmenu: false },
  { name: 'About', icon: UserIcon, link: '/about', hasSubmenu: false },
  { name: 'Blogs', icon: DocumentTextIcon, link: '/blogs', hasSubmenu: true },
  { name: 'Memory', icon: BookOpenIcon, link: '/memory', hasSubmenu: false },
  { name: 'Project', icon: CodeBracketIcon, link: '/project', hasSubmenu: false },
  { name: 'Friend', icon: UserGroupIcon, link: '/friend', hasSubmenu: false },
  { name: 'Contact', icon: EnvelopeIcon, link: '/contact', hasSubmenu: false },
  { name: 'WebSocket', icon: WifiIcon, link: '/websocket-test', hasSubmenu: false },
];

// --- Methods ---
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
    const [categoryRes, countRes] = await Promise.all([
      getCategoryList(),
      getCategoryCount(),
    ]);

    if (categoryRes.data) {
      const counts = new Map(
        (countRes.data as any).map((c: any) => [c.id, c.count])
      );
      categories.value = categoryRes.data.map((category: any) => ({
        ...category,
        articleCount: counts.get(category.id) || 0,
      }));
    } else {
      categories.value = [];
      console.warn("获取分类数据为空或接口格式不符");
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
    categories.value = [];
    messageService.error("加载分类失败");
  } finally {
    categoriesLoading.value = false;
  }
};

const filterByCategory = (categoryId?: number): void => {
  const query: Record<string, string> = {};
  if (categoryId !== undefined) {
    query.categoryId = String(categoryId);
  }
  router.push({ path: '/blogs', query });
  
  if (isMobile.value) {
    closeMobileSidebar();
  }
};

const handleNavClick = (item: any) => {
  if (item.hasSubmenu) {
    toggleSubmenu(item.name);
  } else {
    router.push(item.link);
    if (isMobile.value) {
      closeMobileSidebar();
    }
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.main-navigation {
  @apply space-y-2 mb-8;
}

.nav-item-container {
  /* Base container for transition */
}

.nav-item {
  @apply flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg transition-colors cursor-pointer;
  @apply hover:bg-slate-100;
  @apply dark:text-gray-300 dark:hover:bg-gray-800;
}
.nav-item.active {
  @apply bg-slate-100 text-blue-600;
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

.submenu {
  @apply pl-9 mt-1 space-y-1 overflow-hidden transition-all duration-300;
}

.submenu-item {
  @apply py-2 px-3 text-sm rounded-md cursor-pointer flex items-center justify-between transition-colors;
  @apply hover:bg-slate-100;
  @apply dark:text-gray-300 dark:hover:bg-gray-800;
}
.submenu-item.active {
  @apply text-blue-600 font-medium bg-blue-50;
  @apply dark:bg-blue-900/20 dark:text-blue-400;
}

.submenu-loading, .submenu-empty {
  @apply py-2 px-3 text-sm text-gray-500 italic;
  @apply dark:text-gray-300;
}

.loading-indicator {
  @apply flex items-center;
}

.loading-spinner {
  @apply animate-spin h-4 w-4 mr-2 text-blue-600;
  @apply dark:text-blue-400;
}
.loading-spinner circle { @apply opacity-25; }
.loading-spinner path { @apply opacity-75; }

.nav-item-enter-active,
.nav-item-leave-active {
  transition: all 0.3s ease;
}
.nav-item-enter-from,
.nav-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.nav-item-move {
  transition: transform 0.3s ease;
}
</style>
