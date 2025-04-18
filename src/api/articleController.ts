// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 此处后端没有提供注释 POST /article/add */
export async function doSubmitArticle(
  body: API.ArticleSubmitDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/article/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /article/blogs */
export async function getArticleInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleInfoParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticleInfoVO>("/article/blogs", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /article/categories */
export async function getArticleCategoryList(options?: { [key: string]: any }) {
  return request<API.BaseResponseListArticleCategoryVO>("/article/categories", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /article/categories/count */
export async function getCategoryCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseListArticleCategoryCountVO>(
    "/article/categories/count",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /article/category/add */
export async function submitCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.submitCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticleCategoryVO>("/article/category/add", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /article/list */
export async function getArticlePageList(
  body: API.ArticleQueryDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResponseArticlePageVO>("/article/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /article/tag/add */
export async function submitTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.submitTagParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticleTagVO>("/article/tag/add", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /article/tags */
export async function getArticleTagList(options?: { [key: string]: any }) {
  return request<API.BaseResponseListArticleTagVO>("/article/tags", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /article/tags/count */
export async function getTagCount(options?: { [key: string]: any }) {
  return request<API.BaseResponseListArticleTagCountVO>("/article/tags/count", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /article/tag/${param0} */
export async function deleteTag(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTagParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseString>(`/article/tag/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /article/category/${param0} */
export async function deleteCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCategoryParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseString>(`/article/category/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /article/thumb/${param0} */
export async function doThumb(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.doThumbParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean>(`/article/thumb/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}