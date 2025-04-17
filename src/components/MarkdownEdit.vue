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
                @onUploadImg="handleUploadImage" :formatCopiedText="formatCopiedText" :showToolbarName = "true"
                :footers="['markdownTotal', '=', 0, 'scrollSwitch']" :toolbars="toolbars">
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
import { MdEditor, NormalFooterToolbar, type ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import parseTime from "@/utils/time";
import { useTheme } from '../utils/theme'
import { markdownUpload } from "@/api/markdownController";
import { message } from "ant-design-vue";

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
    'upload-image',
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
        const response = await markdownUpload(file);
        // 处理响应对象，这里假设后端返回的是 API.BaseResponseString 类型
        if (response.data && response.data.code === 0 && response.data.data) {
            content.value = response.data.data;
            message.success('Markdown 文件上传成功');
        } else {
            message.error(response.data?.message || 'Markdown 文件上传失败');
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
    'image',
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
</style>