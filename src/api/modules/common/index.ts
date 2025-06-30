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
    return request.post('/api/pic/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } else {
    return request.post('/api/pic/upload', data);
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
  return request.get('/api/picture/list', { params });
}

/**
 * 删除图片
 */
export function deletePicture(id: number): Promise<BooleanResponse> {
  return request.delete(`/api/picture/${id}`);
}

/**
 * 获取图片服务列表
 */
export function getPicServiceList(): Promise<UploadModel[]> {
  return request.get('/api/picture/service/list');
}

/**
 * 注册图片服务
 */
export function register(model: string): Promise<BooleanResponse> {
  return request.post('/api/picture/service/register', { model });
}

// ============= 系统相关 =============
/**
 * 系统健康检查
 */
export function healthCheck(): Promise<StringResponse> {
  return request.get('/api/health');
}

/**
 * 获取系统信息
 */
export function getSystemInfo(): Promise<any> {
  return request.get('/api/system/info');
} 