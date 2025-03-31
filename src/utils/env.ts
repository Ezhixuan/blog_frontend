/**
 * 环境变量工具函数
 * 提供访问环境变量的便捷方法
 */

/**
 * 获取环境变量
 * @param key 环境变量名称
 * @param defaultValue 默认值（如果环境变量不存在）
 * @returns 环境变量值或默认值
 */
export function getEnv<T = string>(key: string, defaultValue?: T): string | T {
  const envValue = import.meta.env[key];
  if (envValue === undefined) {
    return defaultValue as T;
  }
  return envValue;
}

/**
 * 获取布尔类型的环境变量
 * @param key 环境变量名称
 * @param defaultValue 默认值（如果环境变量不存在）
 * @returns 布尔值
 */
export function getBooleanEnv(key: string, defaultValue = false): boolean {
  const envValue = import.meta.env[key];
  if (envValue === undefined) {
    return defaultValue;
  }
  return envValue === 'true';
}

/**
 * 获取数字类型的环境变量
 * @param key 环境变量名称
 * @param defaultValue 默认值（如果环境变量不存在或无法转换为数字）
 * @returns 数字值
 */
export function getNumberEnv(key: string, defaultValue = 0): number {
  const envValue = import.meta.env[key];
  if (envValue === undefined) {
    return defaultValue;
  }
  const num = Number(envValue);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 获取当前环境
 * @returns 当前环境名称
 */
export function getCurrentEnv(): string {
  return import.meta.env.VITE_APP_ENV || 'development';
}

/**
 * 检查是否为开发环境
 * @returns 是否为开发环境
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * 检查是否为生产环境
 * @returns 是否为生产环境
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * 检查是否启用调试模式
 * @returns 是否启用调试模式
 */
export function isDebugMode(): boolean {
  return getBooleanEnv('VITE_APP_DEBUG', false);
}

/**
 * 获取API基础URL
 * @returns API基础URL
 */
export function getApiBaseUrl(): string {
  return getEnv('VITE_APP_API_BASE_URL', '');
}

/**
 * 获取应用标题
 * @returns 应用标题
 */
export function getAppTitle(): string {
  return getEnv('VITE_APP_TITLE', '个人博客');
}