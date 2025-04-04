import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { useTheme, initTheme } from './utils/theme'
import { watch, ref } from 'vue'
import { createPinia } from 'pinia'

// 创建 Pinia 实例
const pinia = createPinia()

// 导入用户状态存储
import { useUserStore } from './stores/user'

// 初始化主题
initTheme();

// 获取当前主题状态
const { currentTheme } = useTheme();
const isDarkMode = () => currentTheme.value === 'dark';


// 监听主题变化，重新配置编辑器
watch(currentTheme, () => {
  // 添加data-theme属性，确保DOM能够正确反映当前主题
  console.log(currentTheme.value);
  console.log(isDarkMode)
  document.documentElement.setAttribute('data-theme', currentTheme.value);
});

// 创建应用
const app = createApp(App);

// 使用插件
app.use(router);
app.use(Antd);
app.use(pinia); // 使用Pinia

// 初始化用户信息
const userStore = useUserStore();
userStore.init();

// 挂载应用
app.mount('#app');