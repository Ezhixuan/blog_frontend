<template>
  <div class="websocket-demo">
    <div class="demo-header">
      <h2>WebSocket 消息测试</h2>
      <div class="connection-status">
        <span :class="['status-dot', { 'connected': isConnected }]"></span>
        <span>{{ isConnected ? '已连接' : '未连接' }}</span>
        <span class="user-id">用户ID: {{ userId }}</span>
        <span class="online-count">在线用户: {{ onlineCount }}</span>
      </div>
    </div>

    <div class="demo-content">
      <div class="test-buttons">
        <h3>发送测试消息</h3>
        <div class="button-group">
          <button @click="sendTestMessage('success')" class="btn btn-success">
            发送成功消息
          </button>
          <button @click="sendTestMessage('info')" class="btn btn-info">
            发送信息消息
          </button>
          <button @click="sendTestMessage('warning')" class="btn btn-warning">
            发送警告消息
          </button>
          <button @click="sendTestMessage('error')" class="btn btn-error">
            发送错误消息
          </button>
        </div>
      </div>

      <div class="custom-message">
        <h3>自定义消息</h3>
        <div class="form-group">
          <label>消息类型:</label>
          <select v-model="customMessage.type">
            <option value="success">成功</option>
            <option value="info">信息</option>
            <option value="warning">警告</option>
            <option value="error">错误</option>
          </select>
        </div>
        <div class="form-group">
          <label>消息标题:</label>
          <input v-model="customMessage.title" type="text" placeholder="请输入消息标题" />
        </div>
        <div class="form-group">
          <label>消息内容:</label>
          <textarea v-model="customMessage.content" placeholder="请输入消息内容"></textarea>
        </div>
        <button @click="sendCustomMessage" class="btn btn-primary">
          发送自定义消息
        </button>
      </div>

      <div class="message-log">
        <h3>消息记录</h3>
                 <div class="log-container">
           <div v-for="(message, index) in messageLog" :key="index" 
                :class="['message-item', `message-${message.type || 'info'}`]">
             <div class="message-header">
               <span class="message-type">{{ (message.type || 'info').toUpperCase() }}</span>
               <span class="message-time">{{ formatTime(message.timestamp || Date.now()) }}</span>
             </div>
            <div class="message-title">{{ message.title }}</div>
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        <button @click="clearMessageLog" class="btn btn-secondary">
          清空日志
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useWebSocket, type WebSocketMessage, type BackendMessage } from '@/composables/useWebSocket';
import request from '@/utils/core/request';

const { isConnected, userId, setMessageHandler, sendMessage } = useWebSocket();

// 在线用户数量
const onlineCount = ref(0);

// 消息日志
const messageLog = ref<BackendMessage[]>([]);

// 自定义消息
const customMessage = ref({
  type: 'info',
  title: '',
  content: ''
});

// 设置消息处理器
setMessageHandler((message: WebSocketMessage) => {
  console.log('接收到消息:', message);
  
  // 添加到消息日志
  const backendMessage = message as BackendMessage;
  messageLog.value.unshift({
    ...backendMessage,
    timestamp: message.timestamp || Date.now()
  });
  
  // 限制日志数量
  if (messageLog.value.length > 50) {
    messageLog.value = messageLog.value.slice(0, 50);
  }
});

// 发送测试消息
const sendTestMessage = async (type: string) => {
  try {
    const response = await request.post(`/api/websocket/test/${type}`, {
      title: `测试${type}消息`,
      content: `这是一条测试的${type}消息，时间：${new Date().toLocaleString()}`
    });
    console.log('发送测试消息成功:', response);
  } catch (error) {
    console.error('发送测试消息失败:', error);
  }
};

// 发送自定义消息
const sendCustomMessage = async () => {
  if (!customMessage.value.title || !customMessage.value.content) {
    alert('请填写消息标题和内容');
    return;
  }
  
  try {
    const response = await request.post(`/api/websocket/test/${customMessage.value.type}`, {
      title: customMessage.value.title,
      content: customMessage.value.content
    });
    console.log('发送自定义消息成功:', response);
    
    // 清空表单
    customMessage.value.title = '';
    customMessage.value.content = '';
  } catch (error) {
    console.error('发送自定义消息失败:', error);
  }
};

// 获取在线用户数量
const getOnlineCount = async () => {
  try {
    const response = await request.get('/api/websocket/test/online-count');
    onlineCount.value = response.data;
  } catch (error) {
    console.error('获取在线用户数量失败:', error);
  }
};

// 清空消息日志
const clearMessageLog = () => {
  messageLog.value = [];
};

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString();
};

// 定时获取在线用户数量
let onlineCountInterval: NodeJS.Timeout;

onMounted(() => {
  // 初始获取在线用户数量
  getOnlineCount();
  
  // 每10秒更新一次在线用户数量
  onlineCountInterval = setInterval(() => {
    getOnlineCount();
  }, 10000);
});

onUnmounted(() => {
  if (onlineCountInterval) {
    clearInterval(onlineCountInterval);
  }
});
</script>

<style scoped>
.websocket-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc3545;
  transition: background-color 0.3s;
}

.status-dot.connected {
  background: #28a745;
}

.user-id, .online-count {
  font-size: 14px;
  color: #6c757d;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.test-buttons, .custom-message {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-log {
  grid-column: 1 / -1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-success { background: #28a745; color: white; }
.btn-info { background: #17a2b8; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-error { background: #dc3545; color: white; }
.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.message-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border-left: 4px solid;
}

.message-success { 
  background: #d4edda; 
  border-left-color: #28a745; 
}
.message-info { 
  background: #d1ecf1; 
  border-left-color: #17a2b8; 
}
.message-warning { 
  background: #fff3cd; 
  border-left-color: #ffc107; 
}
.message-error { 
  background: #f8d7da; 
  border-left-color: #dc3545; 
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-type {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 12px;
  color: #6c757d;
}

.message-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.message-content {
  font-size: 14px;
  color: #495057;
}

@media (max-width: 768px) {
  .demo-content {
    grid-template-columns: 1fr;
  }
  
  .demo-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .connection-status {
    flex-wrap: wrap;
  }
}
</style> 