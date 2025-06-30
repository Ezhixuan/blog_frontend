<script setup lang="ts">
defineProps<{
  title: string;
  summary: string;
  date: string;
  imageUrl?: string;
}>();
</script>

<template>
  <article class="blog-card">
    <img v-if="imageUrl" :src="imageUrl" :alt="title" class="blog-image">
    <h2 class="blog-title">{{ title }}</h2>
    <p class="blog-summary">{{ summary }}</p>
    <div class="blog-footer">
      <span class="blog-date">{{ date }}</span>
      <button class="blog-button">
        阅读更多
      </button>
    </div>
  </article>
</template>

<style scoped>
.blog-card {
  @apply p-6 mb-8;
}

.blog-image {
  @apply w-full h-48 object-cover rounded-lg mb-4;
}

.blog-title {
  @apply text-xl font-semibold text-gray-800 mb-2;
}

.blog-summary {
  @apply text-gray-600 mb-4;
}

.blog-footer {
  @apply flex items-center justify-between;
}

.blog-date {
  @apply text-sm text-gray-500;
}

.blog-button {
  @apply text-primary hover:text-secondary transition-colors duration-200;
}
</style>