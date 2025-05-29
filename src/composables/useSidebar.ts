import { ref, onMounted, onUnmounted } from 'vue'

const isMobileSidebarOpen = ref(false)

export function useSidebar() {
  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  const closeMobileSidebar = () => {
    isMobileSidebarOpen.value = false
  }

  const openMobileSidebar = () => {
    isMobileSidebarOpen.value = true
  }

  // 监听屏幕尺寸变化，在桌面端自动关闭移动端侧边栏
  const handleResize = () => {
    if (window.innerWidth >= 1024) { // lg断点
      isMobileSidebarOpen.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
    openMobileSidebar
  }
} 