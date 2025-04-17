// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 上传 Markdown 文件 POST /md/upload */
export async function markdownUpload(
  file: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request<API.BaseResponseString>("/md/upload", {
    method: "POST",
    headers: {
      ...(options?.headers || {})
    },
    params: {},
    data: formData,
    transformRequest: [(data, headers) => {
      if (headers) delete headers['Content-Type'];
      return data;
    }],
    ...(options || {}),
  });
}
