<script setup lang="ts">
import { ref } from 'vue';
import { HomeIcon, UserIcon, DocumentTextIcon, CodeBracketIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from 'vue-router';

const menuItems = [
  { name: 'Home', icon: HomeIcon, link: '/' },
  { name: 'About', icon: UserIcon, link: '/about' },
  { name: 'Blogs', icon: DocumentTextIcon, link: '/blogs', hasSubmenu: true },
  { name: 'Project', icon: CodeBracketIcon, link: '/project' },
  { name: 'Friend', icon: UserGroupIcon, link: '/friend' },
  { name: 'Contact', icon: EnvelopeIcon, link: '/contact' },
];

const categories = [
  { name: 'tech', count: 14 },
  { name: 'project', count: 1 },
  { name: 'todo', count: 1 },
  { name: 'Uncategorized', count: 1 },
  { name: 'life', count: 1 },
];

const tags = [
  { name: 'Frosti', count: 2 },
  { name: 'Blog', count: 2 },
];
</script>

<template>
  <aside class="w-64 bg-white shadow-lg p-6 min-h-screen">
    <!-- Profile -->
    <div class="text-center mb-8">
      <img src="https://avatars.githubusercontent.com/u/46998172?v=4" 
           alt="Profile" 
           class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-100 hover:rotate-[360deg] transition-transform duration-500"
      >
    </div>

    <!-- Navigation -->
    <nav class="space-y-2 mb-8">
      <RouterLink v-for="item in menuItems" 
         :key="item.name"
         :to="item.link"
         class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-slate-100 rounded-lg transition-colors"
         active-class="bg-slate-100 text-blue-600"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
        <span v-if="item.hasSubmenu" class="ml-auto">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </RouterLink>
    </nav>

    <!-- Social Links -->
    <div class="flex justify-center space-x-4 mb-8">
      <a href="https://github.com" class="text-gray-600 hover:text-gray-900">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
        </svg>
      </a>
      <a href="#" class="text-gray-600 hover:text-gray-900">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      </a>
    </div>

    <!-- Categories -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Categories</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="category in categories" 
              :key="category.name"
              class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center"
        >
          {{ category.name }}
          <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs">{{ category.count }}</span>
        </span>
      </div>
    </div>

    <!-- Tags -->
    <div>
      <h3 class="text-lg font-semibold mb-4">Tags</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in tags" 
              :key="tag.name"
              class="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center"
        >
          {{ tag.name }}
          <span class="ml-2 bg-slate-200 px-2 rounded-full text-xs">{{ tag.count }}</span>
        </span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 暂无需要的样式 */
</style>