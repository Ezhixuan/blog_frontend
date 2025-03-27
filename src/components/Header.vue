<script setup lang="ts">
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const isMenuOpen = ref(false);
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="blog-container py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-primary">My Blog</h1>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="/" class="nav-link">首页</a>
          <a href="/articles" class="nav-link">文章</a>
          <a href="/about" class="nav-link">关于我</a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="isMenuOpen = !isMenuOpen" class="text-gray-500">
            <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 space-y-4">
        <a href="/" class="block nav-link">首页</a>
        <a href="/articles" class="block nav-link">文章</a>
        <a href="/about" class="block nav-link">关于我</a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* 暂无需要的样式 */
</style>