<template>
    <div>
        <div class="editor-header">
            <button type="button" class="upload-md-button" @click="handleUploadMdClick"
                :disabled="isUploading">
                <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{{ isUploading ? "上传中..." : "上传Markdown" }}</span>
            </button>
            <input ref="fileInputRef" type="file" accept=".md" style="display: none" @change="handleFileChange" />
            
            <!-- 自定义图片选择按钮 -->
            <button type="button" class="select-image-button" @click="handleSelectImage">
                <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>选择图片</span>
            </button>
            
            <button type="button" class="ai-generate-button" @click="$emit('generate-content')"
                :disabled="isGenerating || !title">
                <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ isGenerating ? "生成中..." : "AI生成内容" }}</span>
            </button>
        </div>
        <div class="editor-container">
            <MdEditor v-model="content" :style="{ height: '500px' }" :theme="theme" class="markdown-editor"
                :formatCopiedText="formatCopiedText" :showToolbarName = "true"
                :footers="['markdownTotal', '=', 0, 'scrollSwitch']" :toolbars="toolbars">
                <template #defFooters>
                    <NormalFooterToolbar>{{ parseTime(new Date()) }}</NormalFooterToolbar>
                </template>
            </MdEditor>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { MdEditor, NormalFooterToolbar, type ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import parseTime from "@/utils/helpers/time";
import { useTheme } from '@/utils/helpers/theme'
import { markdownUpload } from "@/api/markdownController";
import { message } from "ant-design-vue";
import { PICTURE_TYPES } from "@/utils/constants/pictureTypes";

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
    showToolbarName: {
        type: Boolean,
        default: true,
    },

});

const formatCopiedText = (text: string) => {
  return `${text}  - from md-editor-v3`;
};

const emit = defineEmits([
    'update:modelValue',
    'select-image',
    'generate-content',
]);

const content = ref(props.modelValue);
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 根据传入的 isDark 属性计算主题
const { currentTheme } = useTheme();
const theme = computed(() => currentTheme.value);

// 监听内容变化
watch(content, async () => {
    emit("update:modelValue", content.value);
});

// 处理上传 Markdown 文件按钮点击
const handleUploadMdClick = () => {
    fileInputRef.value?.click();
};

// 处理文件选择
const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];
    // 检查文件类型
    if (!file.name.toLowerCase().endsWith('.md')) {
        message.error('只能上传 Markdown (.md) 文件');
        return;
    }

    try {
        isUploading.value = true;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', PICTURE_TYPES.CONTENT.toString());
        const response = await markdownUpload(formData);
        // 处理响应对象，这里假设后端返回的是 API.BaseResponseString 类型
        console.log('Response:', response);
        console.log('Response code type:', typeof response.code, 'value:', response.code);
        console.log('Response data type:', typeof response.data, 'value:', !!response.data);
        console.log('Condition result:', response.code === 200 && !!response.data);
        
        if (response.code === 0 && response.data) {
            content.value = response.data;
            message.success('Markdown 文件上传成功');
        } else {
            console.log('进入失败分支 - code:', response.code, 'data:', !!response.data);
            message.error(response.message || 'Markdown 文件上传失败');
        }
    } catch (error: any) {
        message.error(error?.response?.data?.message || 'Markdown 文件上传失败');
        console.error('上传失败', error);
    } finally {
        isUploading.value = false;
        // 重置文件输入框，以便重复上传相同文件
        if (fileInputRef.value) {
            fileInputRef.value.value = '';
        }
    }
};

// 处理自定义图片选择按钮点击
const handleSelectImage = () => {
    emit('select-image');
};

// 插入图片到编辑器
const insertImage = (imageUrl: string, altText: string = '图片') => {
    const imageMarkdown = `![${altText}](${imageUrl})`;
    content.value += `\n${imageMarkdown}\n`;
};

// 暴露插入图片方法给父组件
defineExpose({
    insertImage
});

const toolbars: ToolbarNames[] = [
    'bold',
    'underline',
    'italic',
    '-',
    'strikeThrough',
    'title',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task', // ^2.4.0
    '-',
    'codeRow',
    'code',
    'link',
    'table',
    'mermaid',
    'katex',
    '=',
    'pageFullscreen',
    'preview',
];
</script>

<style scoped>
.editor-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
    gap: 0.5rem; /* 按钮之间的间距 */
}

.upload-md-button {
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
    background-image: linear-gradient(to right, #10b981, #06b6d4);
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transform: var(--tw-transform);
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
        var(--tw-shadow, 0 0 #0000);
    overflow: hidden;
}

.dark .upload-md-button {
    background-image: linear-gradient(to right, #059669, #0891b2);
}

.upload-md-button:hover {
    background-image: linear-gradient(to right, #059669, #0891b2);
    transform: var(--tw-transform);
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
        0 2px 4px -2px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .upload-md-button:hover {
    background-image: linear-gradient(to right, #047857, #0e7490);
}

.upload-md-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
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

/* 图片选择按钮样式 */
.select-image-button {
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
    background-image: linear-gradient(to right, #f59e0b, #f97316);
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transform: var(--tw-transform);
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
        var(--tw-shadow, 0 0 #0000);
    overflow: hidden;
}

.dark .select-image-button {
    background-image: linear-gradient(to right, #d97706, #ea580c);
}

.select-image-button:hover {
    background-image: linear-gradient(to right, #d97706, #ea580c);
    transform: var(--tw-transform);
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
        0 2px 4px -2px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.dark .select-image-button:hover {
    background-image: linear-gradient(to right, #b45309, #c2410c);
}

.button-icon {
    height: 0.75rem;
    width: 0.75rem;
    margin-right: 0.25rem;
}

/* 新增工具栏图标样式 */
:deep(.md-editor-toolbar) {
    --md-badge-icon-size: 20px;
    --md-editor-icon-size: 20px;
}

:deep(.md-editor-toolbar-item svg) {
    width: 20px;
    height: 20px;
}

/* 调整工具栏整体高度 */
:deep(.md-editor-toolbar-wrapper) {
    height: 42px;
}

/* 调整工具栏按钮间距 */
:deep(.md-editor-toolbar-item) {
    padding: 10px 6px;
}

/* 自定义工具栏图标样式 */
.toolbar-icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
}

/* 自定义按钮悬停效果 */
:deep(.md-editor-toolbar-item:hover) {
    background-color: var(--md-color, #f0f0f0);
}

:deep(.dark .md-editor-toolbar-item:hover) {
    background-color: var(--md-color, #3a3a3a);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .upload-md-button,
  .select-image-button,
  .ai-generate-button {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  /* 编辑器容器适配移动端 */
  .editor-container {
    width: 100%;
    overflow-x: hidden;
  }
  
  /* 编辑器工具栏移动端优化 */
  :deep(.md-editor-toolbar-wrapper) {
    flex-wrap: wrap;
    height: auto;
    min-height: 42px;
    overflow-x: auto;
    padding: 5px;
  }
  
  /* 工具栏项目在移动端的间距调整 */
  :deep(.md-editor-toolbar-item) {
    padding: 8px 5px;
    min-width: 36px;
    flex-shrink: 0;
  }
  
  /* 工具栏分隔符在移动端的处理 */
  :deep(.md-editor-toolbar-item-divider) {
    margin: 0 2px;
  }
  
  /* 编辑器内容区域移动端优化 */
  :deep(.md-editor-content-wrapper) {
    overflow-x: hidden;
  }
  
  /* 预览和编辑区域在移动端的优化 */
  :deep(.md-editor-preview),
  :deep(.md-editor-input-wrapper) {
    overflow-x: hidden;
    word-wrap: break-word;
  }
  
  /* 编辑器文本域移动端优化 */
  :deep(.md-editor-input) {
    font-size: 16px; /* 防止iOS缩放 */
    overflow-x: hidden;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .upload-md-button,
  .select-image-button,
  .ai-generate-button {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .button-icon {
    height: 0.5rem;
    width: 0.5rem;
  }
  
  /* 工具栏在超小屏幕的优化 */
  :deep(.md-editor-toolbar-item) {
    padding: 6px 3px;
    min-width: 32px;
  }
  
  :deep(.md-editor-toolbar-item svg) {
    width: 16px;
    height: 16px;
  }
}
</style>