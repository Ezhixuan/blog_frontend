import { notification } from 'ant-design-vue';

// 定义消息类型
type MessageType = 'success' | 'info' | 'warning' | 'error';

// 定义通知消息的位置类型
type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

// 自定义通知参数接口
interface NotificationOptions {
  message?: string;
  description?: string;
  duration?: number;
  placement?: NotificationPlacement;
  className?: string; // 用于添加自定义 CSS 类名
  style?: Record<string, string | number>; // 用于直接添加内联样式
  key?: string;
  onClose?: () => void;
  onClick?: () => void;
  btn?: any;
  icon?: any;
  closeIcon?: any;
}

// 定义消息配置接口 (包含可能的自定义样式)
interface MessageOptions extends Omit<NotificationOptions, 'message' | 'description'> {
  duration?: number;
  placement?: NotificationPlacement;
  className?: string; // 用于添加自定义 CSS 类名
  style?: Record<string, string | number>; // 用于直接添加内联样式
}

// 默认配置
const defaultOptions: MessageOptions = {
  duration: 4.5, // 默认显示时间，单位秒
  placement: 'topRight', // 默认显示位置
  className: 'modern-notification', // 默认添加一个用于统一样式的类名
  style: {
    borderRadius: '0.8rem',
    padding: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid transparent',
    overflow: 'hidden',
  },
};

/**
 * 全局消息处理类
 * 用于统一调用Ant Design Vue的Notification通知提醒框，并支持自定义样式
 */
class MessageService {
  /**
   * 显示成功消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  success(message: string, description?: string, options?: MessageOptions) {
    const successStyle = {
      background: 'linear-gradient(145deg, rgba(240, 253, 244, 0.95), rgba(220, 252, 231, 0.95))',
      borderLeft: '4px solid #22c55e',
    };
    this.show('success', message, description, { ...options, style: { ...defaultOptions.style, ...successStyle, ...options?.style } });
  }

  /**
   * 显示信息消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  info(message: string, description?: string, options?: MessageOptions) {
    const infoStyle = {
      background: 'linear-gradient(145deg, rgba(236, 243, 253, 0.95), rgba(219, 234, 254, 0.95))',
      borderLeft: '4px solid #3b82f6',
    };
    this.show('info', message, description, { ...options, style: { ...defaultOptions.style, ...infoStyle, ...options?.style } });
  }

  /**
   * 显示警告消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  warning(message: string, description?: string, options?: MessageOptions) {
    const warningStyle = {
      background: 'linear-gradient(145deg, rgba(255, 247, 237, 0.95), rgba(254, 240, 215, 0.95))',
      borderLeft: '4px solid #f59e0b',
    };
    this.show('warning', message, description, { ...options, style: { ...defaultOptions.style, ...warningStyle, ...options?.style } });
  }

  /**
   * 显示错误消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  error(message: string, description?: string, options?: MessageOptions) {
    const errorStyle = {
      background: 'linear-gradient(145deg, rgba(254, 242, 242, 0.95), rgba(254, 226, 226, 0.95))',
      borderLeft: '4px solid #ef4444',
    };
    this.show('error', message, description, { ...options, style: { ...defaultOptions.style, ...errorStyle, ...options?.style } });
  }

  /**
   * 显示消息的核心方法
   * @param type 消息类型
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  private show(type: MessageType, message: string, description?: string, options?: MessageOptions) {
    const mergedOptions = { ...defaultOptions, ...options };
    notification[type]({
      message,
      description,
      ...mergedOptions,
    });
  }

  /**
   * 关闭所有消息
   */
  closeAll() {
    notification.destroy();
  }
}

// 创建单例实例
const messageService = new MessageService();

// 导出单例实例
export default messageService;