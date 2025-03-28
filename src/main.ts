import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 全局注册 v-md-editor
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

// 导入预览组件
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'

// TOC功能已经包含在预览组件中，不需要单独导入
// import VMdPreviewToc from '@kangc/v-md-editor/lib/preview-toc'
// import '@kangc/v-md-editor/lib/style/preview-toc.css'

import Prism from 'prismjs'

// 配置编辑器
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
})

// 配置预览组件
VMdPreview.use(vuepressTheme, {
  Prism,
})

createApp(App)
  .use(router)
  .use(Antd)
  .use(VueMarkdownEditor)
  .use(VMdPreview)  // 注册预览组件，包含TOC功能
  .mount('#app')