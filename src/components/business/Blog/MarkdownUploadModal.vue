<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>上传 Markdown</h3>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>
      <div class="modal-body">
        <!-- Markdown 文件选择 -->
        <div class="file-input-section">
          <label for="md-file-input" class="file-label">
            <span class="file-button">选择 Markdown 文件</span>
            <span class="file-name">{{ mdFile ? mdFile.name : '未选择文件' }}</span>
          </label>
          <input id="md-file-input" type="file" accept=".md" @change="handleMdFileChange" style="display: none;">
          <p class="input-hint">必须上传一个 .md 文件。</p>
        </div>

        <!-- 图片文件夹选择 -->
        <div class="file-input-section">
          <label for="image-folder-input" class="file-label">
            <span class="file-button">选择图片文件夹 (可选)</span>
            <span class="file-name">{{ imageFiles.length > 0 ? `${imageFiles.length} 张图片` : '未选择文件夹' }}</span>
          </label>
          <input id="image-folder-input" type="file" webkitdirectory @change="handleImageFolderChange" style="display: none;">
          <p class="input-hint">选择一个包含博客图片的文件夹。</p>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-secondary">取消</button>
        <button @click="handleUpload" class="btn btn-primary" :disabled="!mdFile">上传</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close', 'upload']);

const mdFile = ref<File | null>(null);
const imageFiles = ref<File[]>([]);

const handleMdFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.name.toLowerCase().endsWith('.md')) {
      mdFile.value = file;
    } else {
      message.error('请选择一个 .md 文件');
    }
  }
};

const handleImageFolderChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    const imageFileList = files.filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file.name));
    if (imageFileList.length === 0 && files.length > 0) {
        message.warn('选择的文件夹中没有找到支持的图片格式 (jpg, png, gif, webp)。');
    }
    imageFiles.value = imageFileList;
  }
};

const closeModal = () => {
  emit('close');
};

const handleUpload = () => {
  if (!mdFile.value) {
    message.error('必须选择一个 Markdown 文件');
    return;
  }
  emit('upload', {
    mdFile: mdFile.value,
    imageFiles: imageFiles.value,
  });
  // 重置状态
  mdFile.value = null;
  imageFiles.value = [];
};
</script>

<style scoped>
/* --- 玻璃拟态样式 --- */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #1a202c;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dark .modal-content {
  background-color: rgba(26, 32, 44, 0.5); /* 暗黑模式背景色 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.dark .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: #4a5568;
  transition: color 0.2s;
}

.dark .close-button {
  color: #a0aec0;
}

.close-button:hover {
    color: #1a202c;
}

.dark .close-button:hover {
    color: #fff;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-input-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-label {
  cursor: pointer;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.dark .file-label {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
}

.file-label:hover {
  border-color: rgba(49, 130, 206, 0.8);
  background-color: rgba(49, 130, 206, 0.1);
}

.dark .file-label:hover {
  border-color: rgba(99, 179, 237, 0.8);
  background-color: rgba(99, 179, 237, 0.1);
}

.file-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.dark .file-button {
  background-color: rgba(0, 0, 0, 0.3);
  color: #e2e8f0;
}

.file-label:hover .file-button {
    background-color: #3182ce;
    color: white;
}

.dark .file-label:hover .file-button {
    background-color: #63b3ed;
    color: #1a202c;
}

.file-name {
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
}

.dark .file-name {
  color: #a0aec0;
}

.input-hint {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
  text-align: center;
}

.dark .input-hint {
  color: #a0aec0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.dark .modal-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.6rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
}

.btn-primary:hover {
  background-color: #2b6cb0;
  box-shadow: 0 0 15px rgba(49, 130, 206, 0.5);
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
  opacity: 0.6;
}

.dark .btn-primary:disabled {
    background-color: #718096;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.3);
  color: #2d3748;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .btn-secondary {
  background-color: rgba(0, 0, 0, 0.2);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.dark .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
