<template>
  <div 
    v-if="showIndicator"
    class="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-300"
    :class="{ 'opacity-80 hover:opacity-100': true }"
  >
    <div class="flex items-center gap-2 text-sm">
      <!-- 连接状态指示灯 -->
      <div 
        :class="[
          'w-2 h-2 rounded-full transition-colors duration-300',
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        ]"
      ></div>
      
      <!-- 状态文本 -->
      <span class="text-gray-700 dark:text-gray-300 font-medium">
        {{ isConnected ? 'WebSocket已连接' : 'WebSocket未连接' }}
      </span>
      
      <!-- 用户信息 -->
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ userId < 0 ? '游客' : '用户' }}#{{ Math.abs(userId) }}
      </span>
      
      <!-- 关闭按钮 -->
      <button 
        @click="hideIndicator"
        class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        title="隐藏指示器"
      >
        ✕
      </button>
    </div>
    
    <!-- 重连信息 -->
    <div v-if="!isConnected && reconnectAttempts > 0" class="mt-1 text-xs text-orange-600 dark:text-orange-400">
      重连尝试: {{ reconnectAttempts }}/5
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'

// WebSocket状态
const { isConnected, userId, reconnectAttempts } = useWebSocket()

// 控制指示器显示
const showIndicator = ref(true)

// 隐藏指示器
const hideIndicator = () => {
  showIndicator.value = false
  // 存储到localStorage，避免每次都显示
  localStorage.setItem('hideWebSocketIndicator', 'true')
}

// 检查是否应该显示指示器
const shouldShowIndicator = localStorage.getItem('hideWebSocketIndicator') !== 'true'
showIndicator.value = shouldShowIndicator

// 可以通过属性控制是否显示
interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: true
})

// 根据props控制显示
if (!props.visible) {
  showIndicator.value = false
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 