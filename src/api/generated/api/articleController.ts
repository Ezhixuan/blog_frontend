// @ts-ignore
/* eslint-disable */
import request from "../../../utils/request";

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

/** 此处后端没有提供注释 GET /article/detail */
export async function getArticleDetail(
  id: number,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArticlePageVO>(`/article/detail/${id}`, {
    method: "GET",
    ...(options || {}),
  });
}
