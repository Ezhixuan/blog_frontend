<template>
  <div class="websocket-demo p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">WebSocket 连接状态</h2>
    
    <!-- 连接状态显示 -->
    <div class="connection-status mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div 
          :class="[
            'w-3 h-3 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500'
          ]"
        ></div>
        <span class="font-medium">
          {{ isConnected ? '已连接' : '未连接' }}
        </span>
        <span class="text-sm text-gray-600">
          用户ID: {{ userId }} {{ userId < 0 ? '(游客)' : '(登录用户)' }}
        </span>
      </div>
      
      <div v-if="!isConnected && reconnectAttempts > 0" class="text-sm text-orange-600">
        重连尝试次数: {{ reconnectAttempts }}
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls mb-6">
      <button 
        @click="handleConnect"
        :disabled="isConnected"
        class="mr-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        连接
      </button>
      <button 
        @click="handleDisconnect"
        :disabled="!isConnected"
        class="mr-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
      >
        断开
      </button>
      <button 
        @click="sendTestMessage"
        :disabled="!isConnected"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        发送测试消息
      </button>
    </div>

    <!-- 消息发送区域 -->
    <div class="message-sender mb-6">
      <h3 class="text-lg font-semibold mb-2">发送消息</h3>
      <div class="flex gap-2">
        <input 
          v-model="messageContent"
          type="text" 
          placeholder="输入消息内容..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="sendCustomMessage"
        />
        <button 
          @click="sendCustomMessage"
          :disabled="!isConnected || !messageContent.trim()"
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          发送
        </button>
      </div>
    </div>

    <!-- 消息历史 -->
    <div class="message-history">
      <h3 class="text-lg font-semibold mb-2">消息历史</h3>
      <div class="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
        <div 
          v-for="(msg, index) in messageHistory" 
          :key="index"
          class="message-item mb-2 p-2 bg-white rounded border-l-4"
          :class="{
            'border-blue-400': msg.direction === 'sent',
            'border-green-400': msg.direction === 'received'
          }"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-medium text-sm">
                {{ msg.direction === 'sent' ? '发送' : '接收' }}
                <span class="text-gray-500">- {{ msg.type }}</span>
              </div>
              <div class="mt-1">{{ formatMessageData(msg.data) }}</div>
            </div>
            <div class="text-xs text-gray-500">
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>
        
        <div v-if="messageHistory.length === 0" class="text-gray-500 text-center">
          暂无消息
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWebSocket, type WebSocketMessage } from '@/composables/useWebSocket';

interface MessageHistoryItem {
  direction: 'sent' | 'received';
  type: string;
  data: any;
  timestamp: number;
}

// WebSocket相关
const { 
  isConnected, 
  userId, 
  connect, 
  disconnect, 
  sendMessage, 
  setMessageHandler,
  reconnectAttempts 
} = useWebSocket();

// 消息相关
const messageContent = ref('');
const messageHistory = ref<MessageHistoryItem[]>([]);

// 设置消息处理器
setMessageHandler((message: WebSocketMessage) => {
  messageHistory.value.push({
    direction: 'received',
    type: message.type,
    data: message.data,
    timestamp: message.timestamp || Date.now()
  });
});

// 处理连接
const handleConnect = () => {
  connect();
};

// 处理断开
const handleDisconnect = () => {
  disconnect();
};

// 发送测试消息
const sendTestMessage = () => {
  const message: WebSocketMessage = {
    type: 'test',
    data: {
      content: 'Hello WebSocket!',
      userId: userId.value,
      action: 'ping'
    }
  };
  
  if (sendMessage(message)) {
    messageHistory.value.push({
      direction: 'sent',
      type: message.type,
      data: message.data,
      timestamp: Date.now()
    });
  }
};

// 发送自定义消息
const sendCustomMessage = () => {
  if (!messageContent.value.trim()) return;
  
  const message: WebSocketMessage = {
    type: 'custom',
    data: {
      content: messageContent.value,
      userId: userId.value
    }
  };
  
  if (sendMessage(message)) {
    messageHistory.value.push({
      direction: 'sent',
      type: message.type,
      data: message.data,
      timestamp: Date.now()
    });
    messageContent.value = '';
  }
};

// 格式化消息数据
const formatMessageData = (data: any): string => {
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    if (data.content) return data.content;
    return JSON.stringify(data, null, 2);
  }
  return String(data);
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

onMounted(() => {
  console.log('WebSocketDemo 组件已挂载，用户ID:', userId.value);
});
</script>

<style scoped>
.message-item {
  transition: all 0.2s ease;
}

.message-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 