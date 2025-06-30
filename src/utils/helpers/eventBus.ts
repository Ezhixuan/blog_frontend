import { ref } from 'vue';

type EventCallback = (...args: any[]) => void;

interface Events {
  [key: string]: EventCallback[];
}

// 创建一个简单的事件总线
const events = ref<Events>({});

// 注册事件
export function on(event: string, callback: EventCallback) {
  if (!events.value[event]) {
    events.value[event] = [];
  }
  events.value[event].push(callback);
}

// 触发事件
export function emit(event: string, ...args: any[]) {
  if (events.value[event]) {
    events.value[event].forEach(callback => callback(...args));
  }
}

// 移除事件
export function off(event: string, callback?: EventCallback) {
  if (!callback) {
    events.value[event] = [];
  } else if (events.value[event]) {
    events.value[event] = events.value[event].filter(cb => cb !== callback);
  }
}