// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 删除 DELETE /memo/del/${param0} */
export async function del(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.delParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseString>(`/memo/del/${param0}`, {
    method: "DELETE",
    params: {
      ...queryParams,
      idOpt: undefined,
      ...queryParams["idOpt"],
    },
    ...(options || {}),
  });
}

/** 新增 POST /memo/update */
export async function add(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/memo/update", {
    method: "POST",
    params: {
      ...params,
      submitDTO: undefined,
      ...params["submitDTO"],
    },
    ...(options || {}),
  });
}
