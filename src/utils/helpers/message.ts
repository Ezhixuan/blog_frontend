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
  duration: 4.5,
  placement: 'topRight',
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
    const style = {
      background: 'linear-gradient(135deg, #2dd4bf 0%, #10b981 100%)',
    };
    this.show('success', message, description, { ...options, style });
  }

  /**
   * 显示信息消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  info(message: string, description?: string, options?: MessageOptions) {
    const style = {
      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    };
    this.show('info', message, description, { ...options, style });
  }

  /**
   * 显示警告消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  warning(message: string, description?: string, options?: MessageOptions) {
    const style = {
      background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
    };
    this.show('warning', message, description, { ...options, style });
  }

  /**
   * 显示错误消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  error(message: string, description?: string, options?: MessageOptions) {
    const style = {
      background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
    };
    this.show('error', message, description, { ...options, style });
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
      class: `xuan-notification ${mergedOptions.className || ''} ${type}`,
      style: {
        ...mergedOptions.style,
        color: 'white', // 统一设置文字颜色为白色
      },
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
