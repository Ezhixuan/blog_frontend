<template>
  <a-modal
    :visible="isOpen"
    @update:visible="closeModal"
    title="选择头像"
    width="800px"
    :footer="null"
  >
    <div v-if="isFetchingPictures" class="loading-container">
      <a-spin size="large" />
    </div>
    <div v-else class="picture-grid">
      <div
        v-for="picture in pictureList"
        :key="picture.id"
        class="picture-item"
        @click="selectAvatarPicture(picture.url)"
      >
        <img
          :src="picture.url"
          :alt="picture.name"
          class="picture-thumbnail"
        />
        <div class="picture-name">{{ picture.name }}</div>
      </div>
    </div>
    <div class="upload-section">
      <a-upload
        :customRequest="handleAvatarUpload"
        :showUploadList="false"
        accept="image/*"
        :disabled="isUploading"
      >
        <a-button type="primary" :loading="isUploading">
          <upload-outlined />
          上传新头像
        </a-button>
      </a-upload>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadPicture as upload, getPictureList } from '@/api/modules/common';
import { updateUserInfo as editUserInfo } from '@/api/modules/auth';
import messageService from '@/utils/helpers/message';
import { PICTURE_TYPES } from "@/utils/constants/pictureTypes";
import type { PictureUpload } from '@/types';
import { UploadOutlined } from '@ant-design/icons-vue';

// --- Props & Emits ---
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen', 'avatarUpdated']);

// --- Refs ---
const pictureList = ref<PictureUpload[]>([]);
const isFetchingPictures = ref(false);
const isUploading = ref(false);

// --- Methods ---
const closeModal = () => {
  emit('update:isOpen', false);
};

const fetchAvatarPictureList = async () => {
  try {
    isFetchingPictures.value = true;
    const params: any = { current: 1, pageSize: 50, type: PICTURE_TYPES.AVATAR };
    const res = await getPictureList(params);
    if (res.data) {
      pictureList.value = res.data.data || [];
    }
  } catch (error) {
    console.error("获取头像图片列表失败:", error);
    messageService.error("获取图片列表失败");
  } finally {
    isFetchingPictures.value = false;
  }
};

const selectAvatarPicture = async (avatarUrl: string) => {
  isUploading.value = true;
  try {
    const updateResponse = await editUserInfo({ avatar: avatarUrl });
    if (updateResponse.code !== 0 || !updateResponse.data) {
      throw new Error(updateResponse.message || '头像更新失败');
    }
    emit('avatarUpdated', updateResponse.data);
    messageService.success('头像更新成功');
    closeModal();
  } catch (error: any) {
    console.error('头像更新失败:', error);
    messageService.error(error.message || '头像更新失败，请稍后再试');
  } finally {
    isUploading.value = false;
  }
};

const handleAvatarUpload = async (options: any) => {
  const { file } = options;
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    messageService.error('请上传图片文件 (JPG, PNG, GIF, WEBP)');
    return;
  }
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    messageService.error('图片大小不能超过2MB');
    return;
  }

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', String(PICTURE_TYPES.AVATAR));
    
    const uploadResponse = await upload(formData);
    if (uploadResponse.code !== 0 || !uploadResponse.data) {
      throw new Error(uploadResponse.message || '头像上传失败');
    }
    
    const avatarUrl = uploadResponse.data;
    const updateResponse = await editUserInfo({ avatar: avatarUrl });
    if (updateResponse.code !== 0 || !updateResponse.data) {
      throw new Error(updateResponse.message || '头像更新失败');
    }

    pictureList.value.unshift({
      id: Date.now().toString(),
      url: avatarUrl,
      name: file.name,
      type: PICTURE_TYPES.AVATAR
    });
    
    emit('avatarUpdated', updateResponse.data);
    messageService.success('头像更新成功');
    closeModal();
  } catch (error: any) {
    console.error('头像更新失败:', error);
    messageService.error(error.message || '头像更新失败，请稍后再试');
  } finally {
    isUploading.value = false;
  }
};

// --- Watchers ---
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchAvatarPictureList();
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
}

.picture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem 0;
}

.picture-item {
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.picture-item:hover {
  transform: scale(1.05);
  border-color: #3b82f6;
}

.picture-thumbnail {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.picture-name {
  padding: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  background-color: #f8fafc;
  color: #374151;
  border-top: 1px solid #e5e7eb;
}

.upload-section {
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}
</style>
