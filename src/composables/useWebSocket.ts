import { ref, onMounted, onUnmounted, computed, readonly } from 'vue';
import { useUserStore } from '@/stores/user';
import { config } from '@/utils/core/config';
import messageService from '@/utils/helpers/message';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: number;
}

// 定义后端消息格式
export interface BackendMessage {
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  content?: string;
  message?: string;
  data?: any;
  timestamp?: number;
}

export function useWebSocket(url?: string) {
  const userStore = useUserStore();
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = ref<NodeJS.Timeout | null>(null);

  // 计算用户ID - 如果未登录则生成负数随机ID作为游客标识
  const userId = computed(() => {
    if (userStore.isLoggedIn && userStore.userInfo?.id) {
      return userStore.userInfo.id;
    }
    // 生成随机游客ID（负数）
    return -(Math.floor(Math.random() * 1000000) + 1);
  });

  // 获取WebSocket连接URL
  const getWebSocketUrl = () => {
    if (url) return url;
    
    // 使用配置的后端地址，而不是前端地址
    return config.getWebSocketUrl(`/api/ws/link/${userId.value}`);
  };

  // 连接WebSocket
  const connect = () => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log('🔄 正在连接WebSocket:', wsUrl);
      console.log('👤 用户ID:', userId.value);
      console.log('🔧 配置信息:', {
        apiBaseUrl: config.apiBaseUrl,
        wsBaseUrl: config.wsBaseUrl,
        isLoggedIn: userStore.isLoggedIn,
        userInfo: userStore.userInfo
      });
      
      socket.value = new WebSocket(wsUrl);

      socket.value.onopen = () => {
        console.log('✅ WebSocket连接已建立');
        console.log('🔗 连接详情:', {
          url: wsUrl,
          userId: userId.value,
          readyState: socket.value?.readyState
        });
        isConnected.value = true;
        reconnectAttempts.value = 0;
        
        // 发送连接成功消息
        sendMessage({
          type: 'connect',
          data: {
            userId: userId.value,
            isGuest: !userStore.isLoggedIn,
            timestamp: Date.now()
          }
        });
      };

      socket.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('收到WebSocket消息:', message);
          onMessage(message);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
          // 如果解析失败，可能是纯文本消息，直接显示
          if (typeof event.data === 'string') {
            displayMessage({
              type: 'info',
              title: '系统消息',
              content: event.data
            });
          }
        }
      };

      socket.value.onclose = (event) => {
        console.log('❌ WebSocket连接已关闭:', event.code, event.reason);
        console.log('📊 关闭详情:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          url: wsUrl
        });
        isConnected.value = false;
        
        // 如果不是主动关闭，尝试重连
        if (event.code !== 1000 && reconnectAttempts.value < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      socket.value.onerror = (error) => {
        console.error('🚨 WebSocket连接错误:', error);
        console.error('🔍 错误详情:', {
          error: error,
          url: wsUrl,
          readyState: socket.value?.readyState,
          userId: userId.value
        });
        isConnected.value = false;
      };

    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
    }
  };

  // 断开连接
  const disconnect = () => {
    if (reconnectInterval.value) {
      clearTimeout(reconnectInterval.value);
      reconnectInterval.value = null;
    }
    
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.close(1000, '客户端主动断开连接');
    }
    
    socket.value = null;
    isConnected.value = false;
    reconnectAttempts.value = 0;
  };

  // 发送消息
  const sendMessage = (message: WebSocketMessage) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      try {
        const messageWithTimestamp = {
          ...message,
          timestamp: message.timestamp || Date.now()
        };
        socket.value.send(JSON.stringify(messageWithTimestamp));
        return true;
      } catch (error) {
        console.error('发送WebSocket消息失败:', error);
        return false;
      }
    } else {
      console.warn('WebSocket未连接，无法发送消息');
      return false;
    }
  };

  // 重连调度
  const scheduleReconnect = () => {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.error('WebSocket重连次数已达上限');
      return;
    }

    const delay = Math.pow(2, reconnectAttempts.value) * 1000; // 指数退避
    console.log(`${delay}ms后尝试重连 (第${reconnectAttempts.value + 1}次)`);
    
    reconnectInterval.value = setTimeout(() => {
      reconnectAttempts.value++;
      connect();
    }, delay);
  };

  // 消息显示函数
  const displayMessage = (msg: BackendMessage) => {
    const messageType = msg.type || 'info';
    const title = msg.title || msg.message || '系统消息';
    const content = msg.content || msg.data || '';
    
    switch (messageType) {
      case 'success':
        messageService.success(title, content);
        break;
      case 'warning':
        messageService.warning(title, content);
        break;
      case 'error':
        messageService.error(title, content);
        break;
      case 'info':
      default:
        messageService.info(title, content);
        break;
    }
  };

  // 消息处理器（可以被外部覆盖）
  let onMessage = (message: WebSocketMessage) => {
    console.log('默认消息处理器:', message);
    
    // 尝试解析和显示消息
    if (message && typeof message === 'object') {
      // 如果是结构化消息，直接显示
      if (message.type || message.data) {
        displayMessage(message as BackendMessage);
      }
    }
  };

  // 设置消息处理器
  const setMessageHandler = (handler: (message: WebSocketMessage) => void) => {
    onMessage = handler;
  };

  // 生命周期钩子
  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    userId: readonly(userId),
    connect,
    disconnect,
    sendMessage,
    setMessageHandler,
    displayMessage,
    reconnectAttempts: readonly(reconnectAttempts)
  };
} 