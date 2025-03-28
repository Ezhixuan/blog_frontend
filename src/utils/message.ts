import { notification } from 'ant-design-vue';
import type { NotificationArgsProps } from 'ant-design-vue';

// 定义消息类型
type MessageType = 'success' | 'info' | 'warning' | 'error';

// 定义消息配置接口
interface MessageOptions extends Omit<NotificationArgsProps, 'message' | 'description' | 'type'> {
  duration?: number;
  placement?: NotificationArgsProps['placement'];
}

// 默认配置
const defaultOptions: MessageOptions = {
  duration: 4.5, // 默认显示时间，单位秒
  placement: 'topRight', // 默认显示位置
};

/**
 * 全局消息处理类
 * 用于统一调用Ant Design Vue的Notification通知提醒框
 */
class MessageService {
  /**
   * 显示成功消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  success(message: string, description?: string, options?: MessageOptions) {
    this.show('success', message, description, options);
  }

  /**
   * 显示信息消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  info(message: string, description?: string, options?: MessageOptions) {
    this.show('info', message, description, options);
  }

  /**
   * 显示警告消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  warning(message: string, description?: string, options?: MessageOptions) {
    this.show('warning', message, description, options);
  }

  /**
   * 显示错误消息
   * @param message 消息标题
   * @param description 消息描述
   * @param options 其他配置选项
   */
  error(message: string, description?: string, options?: MessageOptions) {
    this.show('error', message, description, options);
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