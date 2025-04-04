<template>
  <div class="md-editor-preview-container" :class="{'dark-theme': theme === 'dark'}">
    <MdPreview
      v-model="text" 
      :preview-only="true"
      :theme="theme"
      :language="language"
      class="full-height-editor"
    />
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  
  const props = defineProps<{
    content: string;
    theme: string;
    language: string;
  }>();
  
  const text = ref(props.content);
  
  // 如果内容需要从外部更新
  watch(() => props.content, (newVal) => {
    text.value = newVal;
  });
  </script>
  
  <style scoped>
.md-editor-preview-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff; /* 默认浅色背景 */
  transition: background-color 0.3s ease;
}

.md-editor-preview-container.dark-theme {
  background-color: #0f1923; /* 深色背景 */
}

/* 深色主题下的编辑器样式 */
.md-editor-preview-container.dark-theme :deep(.md-editor-preview) {
  background-color: #0f1923;
  color: #e0e0e0;
}

/* 深色主题下的代码块样式 */
.md-editor-preview-container.dark-theme :deep(pre) {
  background-color: #212b34 !important;
}

.full-height-editor {
  height: 100%;
  border: none;
}
  </style>