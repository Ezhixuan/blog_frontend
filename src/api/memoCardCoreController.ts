// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 此处后端没有提供注释 GET /memo/list */
export async function list(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResponseMemoCardVO>("/memo/list", {
    method: "GET",
    params: {
      ...params,
      queryDTO: undefined,
      ...params["queryDTO"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /memo/operate */
export async function operate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.operateParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/memo/operate", {
    method: "POST",
    params: {
      ...params,
      operateDTO: undefined,
      ...params["operateDTO"],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /memo/test */
export async function test(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.testParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListMemoCardVO>("/memo/test", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
