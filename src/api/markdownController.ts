// 临时向后兼容文件 - Markdown相关API
import request from '../utils/core/request';
import type { StringResponse } from '../types';

export const markdownUpload = (data: FormData): Promise<StringResponse> => {
  return request.post('/api/markdown/upload', data);
}; 