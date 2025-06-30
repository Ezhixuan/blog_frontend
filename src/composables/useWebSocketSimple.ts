import { useWebSocket, type WebSocketMessage } from './useWebSocket';

/**
 * 简化的 WebSocket 使用示例
 * 只需要在组件中调用这个函数即可自动建立连接
 */
export function useWebSocketSimple() {
  const { 
    isConnected, 
    userId, 
    sendMessage, 
    setMessageHandler 
  } = useWebSocket();

  // 设置默认的消息处理器
  setMessageHandler((message: WebSocketMessage) => {
    console.log('收到WebSocket消息:', message);
    
    // 根据消息类型处理不同的业务逻辑
    switch (message.type) {
      case 'notification':
        // 处理通知消息
        console.log('收到通知:', message.data.content);
        break;
      case 'chat':
        // 处理聊天消息
        console.log('收到聊天消息:', message.data);
        break;
      case 'system':
        // 处理系统消息
        console.log('收到系统消息:', message.data);
        break;
      default:
        console.log('未知消息类型:', message.type);
    }
  });

  // 发送消息的便捷方法
  const sendNotification = (content: string) => {
    return sendMessage({
      type: 'notification',
      data: { content, userId: userId.value }
    });
  };

  const sendChatMessage = (content: string, toUserId?: number) => {
    return sendMessage({
      type: 'chat',
      data: { 
        content, 
        fromUserId: userId.value,
        toUserId: toUserId || null
      }
    });
  };

  return {
    isConnected,
    userId,
    sendMessage,
    sendNotification,
    sendChatMessage,
    setMessageHandler
  };
} 