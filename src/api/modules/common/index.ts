// 通用API
import request from '../../../utils/core/request';
import type {
  PictureUploadData,
  PictureListResponse,
  BooleanResponse,
  StringResponse,
  UploadModel
} from '../../../types';

// ============= 图片上传相关 =============
/**
 * 上传图片
 */
export function uploadPicture(data: FormData | PictureUploadData): Promise<StringResponse> {
  if (data instanceof FormData) {
    // 不手动设置Content-Type，让浏览器自动设置multipart/form-data和boundary
    return request.post('/picture/upload', data);
  } else {
    return request.post('/picture/upload', data);
  }
}

/**
 * 获取图片列表
 */
export function getPictureList(params: {
  current?: number;
  pageSize?: number;
  type?: number;
}): Promise<PictureListResponse> {
  return request.get('/picture/list', { params });
}

/**
 * 删除图片
 */
export function deletePicture(id: number): Promise<BooleanResponse> {
  return request.delete(`/picture/${id}`);
}

/**
 * 获取图片服务列表
 */
export function getPicServiceList(): Promise<UploadModel[]> {
  return request.get('/picture/service/list');
}

/**
 * 注册图片服务
 */
export function register(model: string): Promise<BooleanResponse> {
  return request.post('/picture/service/register', { model });
}

// ============= 系统相关 =============
/**
 * 系统健康检查
 */
export function healthCheck(): Promise<StringResponse> {
  return request.get('/health');
}

/**
 * 获取系统信息
 */
export function getSystemInfo(): Promise<any> {
  return request.get('/system/info');
} 