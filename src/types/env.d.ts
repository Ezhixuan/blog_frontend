/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 应用标题
   */
  readonly VITE_APP_TITLE: string;
  /**
   * API基础URL
   */
  readonly VITE_APP_API_BASE_URL: string;
  /**
   * 是否启用调试模式
   */
  readonly VITE_APP_DEBUG: string;
  /**
   * 当前环境
   */
  readonly VITE_APP_ENV: string;
  /**
   * 开发服务器端口
   */
  readonly VITE_PORT?: string;
  // 可以在此处添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}