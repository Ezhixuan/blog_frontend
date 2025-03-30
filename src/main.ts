import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { useTheme, initTheme } from './utils/theme'
import { watch, ref } from 'vue'

// 全局注册 v-md-editor
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

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

// 导入highlight.js用于GitHub主题
import hljs from 'highlight.js';
// 导入highlight.js样式
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
// 导入常用语言
import 'highlight.js/lib/languages/java';
import 'highlight.js/lib/languages/python';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/typescript';
import 'highlight.js/lib/languages/css';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/bash';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/xml';

// 导入代码复制插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

// 导入消息提示组件
import message from '@/utils/message'

// 初始化主题
initTheme();

// 获取当前主题状态
const { currentTheme } = useTheme();
const isDarkMode = () => currentTheme.value === 'dark';

// 添加代码复制插件
const copyCodePlugin = createCopyCodePlugin({
  buttonText: '复制代码',
  successText: '复制成功',
  failText: '复制失败',
});

// 配置编辑器(使用函数确保重新渲染时应用正确的主题)
const configureEditor = () => {
  // 暂时移除之前的主题配置
  VueMarkdownEditor.vueMarkdownOptions = {};
  VMdPreview.vueMarkdownOptions = {};

  if (isDarkMode()) {
    // 暗色模式使用 GitHub 主题，并且使用highlight.js
    VueMarkdownEditor.use(githubTheme, {
      config: {
        toc: {
          includeLevel: [1, 2, 3,4],
        }
      },
      Hljs: hljs,
    });
    VMdPreview.use(githubTheme, {
      config: {
        toc: {
          includeLevel: [1, 2, 3,4],
        }
      },
      Hljs: hljs,
    });
  } else {
    // 亮色模式使用 VuePress 主题
    VueMarkdownEditor.use(vuepressTheme, {
      Prism,
      config: {
        toc: {
          includeLevel: [1, 2, 3,4],
        }
      },
      codeHighlightExtensionMap: {
        vue: 'html',
      }
    });
    VMdPreview.use(vuepressTheme, {
      Prism,
      config: {
        toc: {
          includeLevel: [1, 2, 3,4],
        }
      },
      codeHighlightExtensionMap: {
        vue: 'html',
      }
    });
  }

  // 添加代码复制插件
  VueMarkdownEditor.use(copyCodePlugin);
  VMdPreview.use(copyCodePlugin);
};

// 初始配置
configureEditor();

// 监听主题变化，重新配置编辑器
watch(currentTheme, () => {
  configureEditor();
  // 添加data-theme属性，确保DOM能够正确反映当前主题
  document.documentElement.setAttribute('data-theme', currentTheme.value);
});

// 创建应用
const app = createApp(App);

// 使用插件
app.use(router);
app.use(Antd);
app.use(VueMarkdownEditor);
app.use(VMdPreview);

// 挂载应用
app.mount('#app');