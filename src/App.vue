<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { onMounted } from 'vue'
import { initTheme } from './utils/theme'

// 确保主题初始化
onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <main class="flex-1 p-11 ml-72">
        <router-view></router-view>
        
        <!-- Footer -->
        <footer class="mt-auto text-sm text-gray-600 dark:text-gray-400 pt-8">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-gray-400 dark:text-gray-500">Copyright ©</span>
            <span>EveSunMaple</span>
            <span>2024 - All rights reserved</span>
          </div>
          <div class="flex items-center justify-center mt-2 space-x-2">
            <span>Powered by</span>
            <span class="font-semibold">Frosti Template ⚡</span>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>