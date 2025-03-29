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

// 导入代码高亮和复制功能
import Prism from 'prismjs'
// 导入更多语言包
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'

// 导入代码复制插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

// 导入消息提示组件
import message from '@/utils/message'

// 配置编辑器
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
})
// 使用代码复制插件，添加复制成功的反馈
VueMarkdownEditor.use(createCopyCodePlugin({
  afterCopy: () => {
    message.success('复制成功')
  }
}))

// 配置预览组件
VMdPreview.use(vuepressTheme, {
  Prism,
})
// 预览组件也使用代码复制插件，添加复制成功的反馈
VMdPreview.use(createCopyCodePlugin({
  afterCopy: () => {
    message.success('复制成功')
  }
}))

createApp(App)
  .use(router)
  .use(Antd)
  .use(VueMarkdownEditor)
  .use(VMdPreview)  // 注册预览组件，包含TOC功能
  .mount('#app')