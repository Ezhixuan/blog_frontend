<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <main class="flex-1 p-8">
        <router-view></router-view>
        
        <!-- Footer -->
        <footer class="mt-auto text-sm text-gray-600 pt-8">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-gray-400">Copyright ©</span>
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