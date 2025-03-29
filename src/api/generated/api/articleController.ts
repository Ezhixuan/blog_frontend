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

/** 此处后端没有提供注释 POST /article/category/add */
export async function submitCategory(
  body: string,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticleCategoryVO>("/article/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
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
  body: string,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticleTagVO>("/article/tag/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
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
