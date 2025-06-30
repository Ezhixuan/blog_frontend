// 临时向后兼容文件 - Markdown相关API
import request from '../utils/core/request';

export const markdownUpload = (data: any) => {
  return request.post('/api/markdown/upload', data);
}; 