<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity" @click="close">
    <div class="relative max-w-[90vw] max-h-[90vh]" @click.stop>
      <!-- 图片容器 -->
      <div class="relative overflow-hidden rounded-lg bg-white shadow-xl" 
           :style="{ transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` }" 
           @mousedown="startDrag" 
           @mousemove="onDrag" 
           @mouseup="stopDrag"
           @mouseleave="stopDrag"
           @wheel.prevent="handleWheel">
        <img :src="imageUrl" 
             class="max-w-full max-h-[90vh] object-contain" 
             @load="onImageLoad" 
             alt="Preview Image" />
      </div>

      <!-- 控制按钮 -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
        <button class="text-white hover:text-blue-400 transition-colors" @click="zoomOut">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <span class="text-white text-sm">{{ Math.round(scale * 100) }}%</span>
        <button class="text-white hover:text-blue-400 transition-colors" @click="zoomIn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button class="text-white hover:text-blue-400 transition-colors" @click="resetZoom">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- 关闭按钮 -->
      <button class="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors" @click="close">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  imageUrl: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

// 缩放相关状态
const scale = ref(1);
const minScale = 0.1;
const maxScale = 3;
const scaleStep = 0.1;

// 拖动相关状态
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const startPosition = ref({ x: 0, y: 0 });

// 监听visible变化，重置状态
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetState();
  }
});

// 重置所有状态
const resetState = () => {
  scale.value = 1;
  position.value = { x: 0, y: 0 };
  isDragging.value = false;
};

// 图片加载完成时的处理
const onImageLoad = () => {
  resetState();
};

// 缩放控制
const zoomIn = () => {
  scale.value = Math.min(scale.value + scaleStep, maxScale);
};

const zoomOut = () => {
  scale.value = Math.max(scale.value - scaleStep, minScale);
};

const resetZoom = () => {
  scale.value = 1;
  position.value = { x: 0, y: 0 };
};

// 鼠标滚轮缩放
const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -scaleStep : scaleStep;
  const newScale = scale.value + delta;
  if (newScale >= minScale && newScale <= maxScale) {
    scale.value = newScale;
  }
};

// 拖动控制
const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = { x: e.clientX, y: e.clientY };
  startPosition.value = { ...position.value };
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  
  const deltaX = e.clientX - dragStart.value.x;
  const deltaY = e.clientY - dragStart.value.y;
  
  position.value = {
    x: startPosition.value.x + deltaX,
    y: startPosition.value.y + deltaY
  };
};

const stopDrag = () => {
  isDragging.value = false;
};

// 关闭预览
const close = () => {
  emit('update:visible', false);
};
</script>