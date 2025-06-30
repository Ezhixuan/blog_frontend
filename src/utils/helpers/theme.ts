import { ref } from 'vue';

// 主题类型
export type Theme = 'light' | 'dark';

// 创建一个响应式的主题状态
const currentTheme = ref<Theme>(getInitialTheme());

// 从localStorage获取初始主题，如果没有则使用系统偏好
function getInitialTheme(): Theme {
  // 尝试从localStorage获取主题设置
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  
  // 如果有存储的主题设置，直接使用
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // 否则检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // 默认使用亮色主题
  return 'light';
}

// 切换主题
export function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  saveTheme(currentTheme.value);
  applyTheme(currentTheme.value);
}

// 设置特定主题
export function setTheme(theme: Theme) {
  currentTheme.value = theme;
  saveTheme(theme);
  applyTheme(theme);
}

// 保存主题到localStorage
function saveTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
}

// 应用主题到文档
function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // 确保Ant Design组件能够识别到主题变化
    const styleElements = document.querySelectorAll('.ant-select, .ant-dropdown, .v-md-editor');
    styleElements.forEach(el => {
      (el as HTMLElement).dataset.theme = 'dark';
    });
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    
    // 确保Ant Design组件能够识别到主题变化
    const styleElements = document.querySelectorAll('.ant-select, .ant-dropdown, .v-md-editor');
    styleElements.forEach(el => {
      (el as HTMLElement).dataset.theme = 'light';
    });
  }
  
  // 触发自定义事件，通知组件主题已变更
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// 初始化主题
export function initTheme() {
  applyTheme(currentTheme.value);
  
  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    });
  }
}

// 暴露当前主题的响应式引用
export function useTheme() {
  return { 
    currentTheme,
    toggleTheme,
    setTheme
  };
} 