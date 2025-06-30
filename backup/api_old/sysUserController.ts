// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 此处后端没有提供注释 POST /user/edit */
export async function editUserInfo(
  body: API.UserEditDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserInfoVO>("/user/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /user/info */
export async function getLoginUserInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserInfoVO>("/user/info", {
    method: "GET",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/login */
export async function doLogin(
  body: API.UserLoginDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSaTokenInfo>("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/logout */
export async function doLogout(options?: { [key: string]: any }) {
  return request<API.BaseResponseString>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /user/register */
export async function doRegister(
  body: API.UserRegisterDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
