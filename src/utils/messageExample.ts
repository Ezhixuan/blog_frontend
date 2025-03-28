/**
 * 消息处理类使用示例
 * 这个文件展示了如何在组件中使用全局消息处理类
 */

// 导入消息处理类
import messageService from './message';

// 示例1：显示成功消息
export function showSuccessMessage() {
  messageService.success('操作成功', '您的操作已成功完成');
}

// 示例2：显示错误消息
export function showErrorMessage(errorMsg: string) {
  messageService.error('操作失败', errorMsg);
}

// 示例3：显示带自定义配置的警告消息
export function showWarningMessage(warningMsg: string) {
  messageService.warning('警告', warningMsg, {
    duration: 10, // 显示10秒
    placement: 'bottomRight', // 在右下角显示
  });
}

// 示例4：显示信息消息
export function showInfoMessage(infoMsg: string) {
  messageService.info('提示', infoMsg);
}

// 示例5：在API请求错误处理中使用
export function handleApiError(error: any) {
  if (error.response) {
    // 处理HTTP错误状态
    switch (error.response.status) {
      case 401:
        messageService.error('未授权', '请先登录');
        break;
      case 403:
        messageService.error('权限不足', '您没有权限执行此操作');
        break;
      case 404:
        messageService.error('资源不存在', '请求的资源不存在');
        break;
      case 500:
        messageService.error('服务器错误', '服务器发生错误，请稍后再试');
        break;
      default:
        messageService.error('请求错误', `HTTP错误: ${error.response.status}`);
    }
  } else if (error.request) {
    // 请求已发出但没有收到响应
    messageService.error('网络错误', '无法连接到服务器，请检查您的网络连接');
  } else {
    // 请求设置触发的错误
    messageService.error('请求错误', error.message || '发生未知错误');
  }
}