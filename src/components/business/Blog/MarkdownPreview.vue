<template>
  <div class="md-editor-preview-container" :class="{'dark-theme': theme === 'dark'}">
    <MdPreview
      v-model="text" 
      :preview-only="true"
      :theme="theme"
      class="full-height-editor"
    />
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed, onMounted } from 'vue';
  import { MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';

  import { useTheme } from '@/utils/helpers/theme'

  const { currentTheme } = useTheme();
  const theme = computed(() => currentTheme.value);
  
  const props = defineProps<{
    content: string;
  }>();
  
  const emit = defineEmits(['content-updated']);
  
  const text = ref(props.content);
  
  // 如果内容需要从外部更新
  watch(() => props.content, (newVal) => {
    text.value = newVal;
  });
  
  onMounted(() => {
    // 在内容渲染完成后触发事件
    emit('content-updated', text.value);
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

/* 移动端优化 */
@media (max-width: 767px) {
  :deep(.md-editor) {
    font-size: 16px !important;
  }
  
  :deep(.md-editor-preview) {
    font-size: 16px !important;
    line-height: 1.8 !important;
  }
  
  :deep(.md-editor-preview-wrapper) {
    padding: 0 !important;
  }
}

/* 平板端优化 */
@media (min-width: 768px) and (max-width: 1023px) {
  :deep(.md-editor) {
    font-size: 15px !important;
  }
  
  :deep(.md-editor-preview) {
    font-size: 15px !important;
    line-height: 1.7 !important;
  }
}
  </style>