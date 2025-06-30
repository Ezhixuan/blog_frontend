/// <reference types="vite/client" />

// Vue 文件声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@kangc/v-md-editor/lib/theme/vuepress.js';
declare module '@kangc/v-md-editor/lib/theme/github.js';
declare module '@kangc/v-md-editor/lib/plugins/copy-code/index';
