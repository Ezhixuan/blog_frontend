<template>
  <div class="projects-container">
    <div class="projects-card">
      <h1 class="projects-title">Projects</h1>
      <div class="projects-grid">
        <div class="project-item">
          <h3 class="project-name">Personal Blog</h3>
          <p class="project-desc">A modern blog built with Vue 3, TypeScript, and Tailwind CSS.</p>
          <div class="project-tags">
            <span class="project-tag">Vue</span>
            <span class="project-tag">TypeScript</span>
            <span class="project-tag">Tailwind</span>
          </div>
          <a href="#" class="project-link">View Project →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无需要的逻辑
</script>

<style scoped>
.projects-container {
  @apply space-y-8;
}

.projects-card {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8;
}

.projects-title {
  @apply text-3xl font-bold mb-6 dark:text-white;
}

.projects-grid {
  @apply grid gap-8 md:grid-cols-2;
}

.project-item {
  @apply bg-slate-50 dark:bg-gray-700 rounded-xl p-6;
}

.project-name {
  @apply text-xl font-semibold mb-3;
}

.project-desc {
  @apply text-gray-600 dark:text-gray-300 mb-4;
}

.project-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.project-tag {
  @apply px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm;
}

.project-link {
  @apply text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300;
}
</style>