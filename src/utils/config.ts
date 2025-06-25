// 应用配置
export const config = {
  // HTTP API 基础地址
  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080',
  
  // WebSocket 基础地址
  wsBaseUrl: import.meta.env.VITE_APP_WS_BASE_URL || (() => {
    // 如果没有单独配置WebSocket地址，基于API地址生成
    const apiUrl = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080';
    return apiUrl.replace(/^http/, 'ws');
  })(),
  
  // 获取WebSocket完整URL
  getWebSocketUrl: (endpoint: string): string => {
    const wsUrl = config.wsBaseUrl;
    // 确保endpoint以/开头
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${wsUrl}${normalizedEndpoint}`;
  }
};

// 开发环境下输出配置信息
if (import.meta.env.DEV) {
  console.log('🔧 应用配置:', {
    apiBaseUrl: config.apiBaseUrl,
    wsBaseUrl: config.wsBaseUrl
  });
} 