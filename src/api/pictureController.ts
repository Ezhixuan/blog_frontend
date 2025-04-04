// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 此处后端没有提供注释 POST /pic/upload */
export async function upload(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadParams,
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  
  // 首先添加文件，确保文件是formData的第一个参数
  if (file) {
    formData.append('file', file);
  }
  
  // 添加其他参数
  if (params) {
    Object.keys(params).forEach(key => {
      // 将所有值转换为字符串
      formData.append(key, String(params[key]));
    });
  }
  
  return request<API.BaseResponseString>("/pic/upload", {
    method: "POST",
    // 关键：完全不设置Content-Type，让浏览器自动处理
    headers: {
      ...(options?.headers || {})
    },
    // 完全不要使用params参数，避免与formData冲突
    params: {},
    data: formData,
    // 删除任何可能的Content-Type头
    transformRequest: [(data, headers) => {
      if (headers) delete headers['Content-Type'];
      return data;
    }],
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /pic/list */
export async function getPictureList(options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResponsePictureUploadVO>("/pic/list", {
    method: "GET",
    ...(options || {}),
  });
}
