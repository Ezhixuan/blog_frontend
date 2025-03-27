<template>
  <div class="blogs-container">
    <div class="blogs-card">
      <h1 class="blogs-title">Blog Posts</h1>
      <div class="blogs-grid">
        <article v-for="i in 3" :key="i" class="blog-item">
          <h2 class="blog-heading">
            <a href="#">Building a Modern Blog with Vue 3 and TypeScript</a>
          </h2>
          <p class="blog-summary">
            Learn how to create a full-featured blog using Vue 3, TypeScript, and Tailwind CSS. 
            We'll cover component design, routing, state management, and more.
          </p>
          <div class="blog-meta">
            <span>March 15, 2024</span>
            <span class="meta-separator">•</span>
            <span>5 min read</span>
            <span class="meta-separator">•</span>
            <a href="#" class="meta-tag">Technical</a>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无需要的逻辑
</script>

<style scoped>
.blogs-container {
  @apply space-y-8;
}

.blogs-card {
  @apply bg-white rounded-2xl shadow-sm p-8;
}

.blogs-title {
  @apply text-3xl font-bold mb-6;
}

.blogs-grid {
  @apply grid gap-8;
}

.blog-item {
  @apply border-b pb-8 last:border-0 last:pb-0;
}

.blog-heading {
  @apply text-2xl font-semibold mb-4 text-gray-800 hover:text-blue-600 transition-colors;
}

.blog-summary {
  @apply text-gray-600 mb-4;
}

.blog-meta {
  @apply flex items-center text-sm text-gray-500;
}

.meta-separator {
  @apply mx-2;
}

.meta-tag {
  @apply text-blue-600 hover:text-blue-800;
}
</style>