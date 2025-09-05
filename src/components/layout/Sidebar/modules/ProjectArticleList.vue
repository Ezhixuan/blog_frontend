<template>
  <div class="project-article-list p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
      项目文档
    </h3>
    <ul v-if="articles.length > 0" class="space-y-2">
      <li v-for="article in articles" :key="article.id">
        <router-link
          :to="`/article/${article.id}?projectId=${projectId}`"
          class="block p-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          active-class="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold"
        >
          {{ article.title }}
        </router-link>
      </li>
    </ul>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">
      该项目下暂无文章。
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ArticleInfo } from '@/types';

interface Props {
  articles: ArticleInfo[];
  projectId: string;
}

defineProps<Props>();
</script>

<style scoped>
.project-article-list {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
