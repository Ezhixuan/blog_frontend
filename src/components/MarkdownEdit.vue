<template>
    <div>
      <div class="editor-header">
        <button
          type="button"
          class="ai-generate-button"
          @click="$emit('generate-content')"
          :disabled="isGenerating || !title"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="button-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{{ isGenerating ? "生成中..." : "AI生成内容" }}</span>
        </button>
      </div>
      <div class="editor-container">
        <MdEditor
          v-model="content"
          :style="{ height: '500px' }"
          :theme="theme"
          class="markdown-editor"
          @onUploadImg="handleUploadImage"
          :footers="['markdownTotal', '=', 0, 'scrollSwitch']"
        >
        <template #defToolbars>
      </template>
        <template #defFooters>
        <NormalFooterToolbar>{{ parseTime(new Date()) }}</NormalFooterToolbar>
        </template>
        </MdEditor>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from "vue";
  import { MdEditor, NormalFooterToolbar } from "md-editor-v3";
  import "md-editor-v3/lib/style.css";
  import parseTime from "@/utils/time";
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    isGenerating: {
      type: Boolean,
      default: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits([
    'update:modelValue',
    'upload-image',
    'generate-content'
  ]);
  
  const content = ref(props.modelValue);
  
  // 根据传入的 isDark 属性计算主题
  const theme = computed(() => props.isDark ? 'dark' : 'light');
  
  // 定义工具栏配置（带文字说明）
  const toolbars = [
    { name: 'bold', tip: '加粗' },
    { name: 'underline', tip: '下划线' },
    { name: 'italic', tip: '斜体' },
    '-',
    { name: 'title', tip: '标题' },
    { name: 'strikeThrough', tip: '删除线' },
    { name: 'sub', tip: '下标' },
    { name: 'sup', tip: '上标' },
    { name: 'quote', tip: '引用' },
    { name: 'unorderedList', tip: '无序列表' },
    { name: 'orderedList', tip: '有序列表' },
    { name: 'task', tip: '任务列表' },
    '-',
    { name: 'codeRow', tip: '行内代码' },
    { name: 'code', tip: '代码块' },
    { name: 'link', tip: '链接' },
    { name: 'image', tip: '图片' },
    { name: 'table', tip: '表格' },
    '-',
    { name: 'revoke', tip: '撤销' },
    { name: 'next', tip: '重做' },
    { name: 'save', tip: '保存' },
    '=',
    { name: 'pageFullscreen', tip: '全屏' },
    { name: 'fullscreen', tip: '全屏编辑' },
    { name: 'preview', tip: '预览' },
    { name: 'htmlPreview', tip: 'HTML预览' },
    { name: 'catalog', tip: '目录' }
  ];
  
  // 监听内容变化
  watch(content, (newValue) => {
    emit('update:modelValue', newValue);
  });

  const handleUploadImage = async (files: File[], callback: (urls: string[]) => void) => {
    const urls: string[] = [];
    
    for (const file of files) {
      try {
        emit("upload-image", file, (url: string) => {
          urls.push(url);
          if (urls.length === files.length) {
            callback(urls);
          }
        });
      } catch (error) {
        console.error("图片上传失败", error);
      }
    }
  };

  </script>
  
  <style scoped>
  .editor-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }
  
  .ai-generate-button {
    display: inline-flex;
    align-items: center;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    border-radius: 0.375rem;
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    background-image: linear-gradient(to right, #6366f1, #8b5cf6);
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transform: var(--tw-transform);
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
      var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
    overflow: hidden;
  }
  
  .dark .ai-generate-button {
    background-image: linear-gradient(to right, #4f46e5, #7c3aed);
  }
  
  .ai-generate-button:hover {
    background-image: linear-gradient(to right, #4f46e5, #7c3aed);
    transform: var(--tw-transform);
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
      0 2px 4px -2px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  
  .dark .ai-generate-button:hover {
    background-image: linear-gradient(to right, #4338ca, #6d28d9);
  }
  
  .ai-generate-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .button-icon {
    height: 0.75rem;
    width: 0.75rem;
    margin-right: 0.25rem;
  }
  </style>