<template>
  <div class="friends-container">
    <div class="friends-card">
      <h1 class="friends-title">Friends</h1>
      <div class="friends-grid">
        <div class="friend-item">
          <div class="friend-profile">
            <img src="https://github.com/github.png" alt="Friend" class="friend-avatar">
            <div>
              <h3 class="friend-name">GitHub</h3>
              <p class="friend-desc">Where the world builds software</p>
            </div>
          </div>
          <a href="https://github.com" class="friend-link">Visit →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂无需要的逻辑
</script>

<style scoped>
.friends-container {
  @apply space-y-8;
}

.friends-card {
  @apply bg-white rounded-2xl shadow-sm p-8;
}

.friends-title {
  @apply text-3xl font-bold mb-6;
}

.friends-grid {
  @apply grid gap-6 md:grid-cols-2 lg:grid-cols-3;
}

.friend-item {
  @apply bg-slate-50 rounded-xl p-6;
}

.friend-profile {
  @apply flex items-center space-x-4;
}

.friend-avatar {
  @apply w-16 h-16 rounded-full;
}

.friend-name {
  @apply font-semibold;
}

.friend-desc {
  @apply text-gray-600 text-sm;
}

.friend-link {
  @apply mt-4 inline-block text-blue-600 hover:text-blue-800;
}
</style>