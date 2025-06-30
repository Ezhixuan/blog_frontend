<script setup lang="ts">
import Sidebar from './components/layout/Sidebar/Sidebar.vue'
import WebSocketIndicator from './components/layout/WebSocketIndicator.vue'
import { onMounted } from 'vue'
import { initTheme } from './utils/helpers/theme'
import { useSidebar } from './composables/useSidebar'
import { Bars3Icon } from '@heroicons/vue/24/outline'
// 导入WebSocket连接
import { useWebSocketSimple } from './composables/useWebSocketSimple'

// 确保主题初始化
onMounted(() => {
  initTheme()
})

// 侧边栏状态管理
const { isMobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar()

// 全局WebSocket连接 - 在应用启动时自动建立连接
const { isConnected, userId } = useWebSocketSimple()

// 在开发模式下显示WebSocket连接状态
if (import.meta.env.DEV) {
  console.log('🔌 WebSocket连接已在应用启动时初始化')
  console.log('📊 WebSocket连接状态:', { isConnected: isConnected.value, userId: userId.value })
  // 可以在这里添加全局的WebSocket事件处理
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- 移动端菜单按钮 -->
    <button
      @click="toggleMobileSidebar"
      class="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <Bars3Icon class="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    <!-- 移动端遮罩层 -->
    <div
      v-if="isMobileSidebarOpen"
      @click="closeMobileSidebar"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    ></div>

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <main class="flex-1 p-4 pt-16 sm:p-6 sm:pt-6 md:p-8 lg:p-11 lg:ml-72">
        <router-view></router-view>
        
        <!-- Footer -->
        <footer class="mt-auto text-sm text-gray-600 dark:text-gray-400 pt-8">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-gray-400 dark:text-gray-500">Copyright ©</span>
            <span>Ezhixuan</span>
            <span>2025 - All rights reserved</span>
          </div>
        </footer>
      </main>
    </div>
    
    <!-- WebSocket状态指示器 -->
    <WebSocketIndicator />
  </div>
</template>