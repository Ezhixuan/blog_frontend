// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 删除 DELETE /deck/del/${param0} */
export async function del(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.del1Params,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseString>(`/deck/del/${param0}`, {
    method: "DELETE",
    params: {
      ...queryParams,
      idOpt: undefined,
      ...queryParams["idOpt"],
    },
    ...(options || {}),
  });
}

/** 列表 GET /deck/list */
export async function listAll(options?: { [key: string]: any }) {
  return request<API.BaseResponsePageResponseMemoDeckVO>("/deck/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 新增 POST /deck/update */
export async function add(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.add1Params,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/deck/update", {
    method: "POST",
    params: {
      ...params,
      memoDeckDTO: undefined,
      ...params["memoDeckDTO"],
    },
    ...(options || {}),
  });
}
