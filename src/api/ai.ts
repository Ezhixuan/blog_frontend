// 临时向后兼容文件 - AI相关API
import request from '../utils/core/request';

export const mockGenerateBlogContent = (data: any) => {
  return request.post('/ai/generate-blog', data);
}; 