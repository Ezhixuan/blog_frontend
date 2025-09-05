<template>
  <div class="taxonomy-section">
    <h3 class="section-title">{{ title }}</h3>
    <div class="section-content-wrapper">
      <div v-if="loading" class="loading-placeholder">
        <span class="loading-indicator">
          <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </span>
      </div>

      <span
        v-for="item in items"
        :key="item.id"
        class="taxonomy-item"
        :class="{ active: $route.query[queryParam] === String(item.id) }"
        @click="filter(item.id)"
      >
        {{ item.name }}
        <span class="taxonomy-count">{{ item.articleCount }}</span>
      </span>

      <div v-if="!loading && items.length === 0" class="empty-placeholder">
        暂无{{ title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getCategoryList, getCategoryCount, getTagList, getTagCount } from '@/api/modules/blog';
import messageService from '@/utils/helpers/message';
import { useSidebar } from '@/composables/useSidebar';

// --- Props ---
const props = defineProps<{
  type: 'categories' | 'tags';
}>();

// --- Composables ---
const router = useRouter();
const { closeMobileSidebar } = useSidebar();

// --- Refs ---
const items = ref<any[]>([]);
const loading = ref(false);

// --- Computed ---
const title = computed(() => props.type === 'categories' ? 'Categories' : 'Tags');
const queryParam = computed(() => props.type === 'categories' ? 'categoryId' : 'tagId');

const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 1024; // lg breakpoint
  }
  return false;
});

// --- Methods ---
const loadData = async () => {
  if (items.value.length > 0 && !loading.value) return;

  loading.value = true;
  try {
    const [listRes, countRes] = props.type === 'categories'
      ? await Promise.all([getCategoryList(), getCategoryCount()])
      : await Promise.all([getTagList(), getTagCount()]);

    if (listRes.data) {
      const counts = new Map(
        (countRes.data as any).map((c: any) => [c.id, c.count])
      );
      items.value = listRes.data.map((item: any) => ({
        ...item,
        articleCount: counts.get(item.id) || 0,
      }));
    } else {
      items.value = [];
      console.warn(`获取${title.value}数据为空或接口格式不符`);
    }
  } catch (error) {
    console.error(`获取${title.value}列表失败:`, error);
    items.value = [];
    messageService.error(`加载${title.value}失败`);
  } finally {
    loading.value = false;
  }
};

const filter = (id?: number) => {
  const query: Record<string, string> = {};
  if (id !== undefined) {
    query[queryParam.value] = String(id);
  }
  router.push({ path: '/blogs', query });

  if (isMobile.value) {
    closeMobileSidebar();
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.taxonomy-section {
  @apply mb-8 animate-fade-slow;
}

.section-title {
  @apply text-lg font-semibold mb-4 dark:text-white;
}

.section-content-wrapper {
  @apply flex flex-wrap gap-2;
}

.loading-placeholder, .empty-placeholder {
  @apply text-sm text-gray-500 italic w-full dark:text-gray-300;
}

.loading-indicator {
  @apply flex items-center;
}

.loading-spinner {
  @apply animate-spin h-4 w-4 mr-2 text-blue-600 dark:text-blue-400;
}
.loading-spinner circle { @apply opacity-25; }
.loading-spinner path { @apply opacity-75; }

.taxonomy-item {
  @apply px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center transition-colors duration-300 transform cursor-pointer;
  @apply hover:bg-slate-200 hover:scale-105;
  @apply dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300;
}
.taxonomy-item.active {
  @apply bg-blue-100 text-blue-800;
  @apply dark:bg-blue-900 dark:text-blue-300;
}

.taxonomy-count {
  @apply ml-2 bg-slate-200 px-2 rounded-full text-xs;
  @apply dark:bg-gray-700 dark:text-gray-300;
}

.animate-fade-slow {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
