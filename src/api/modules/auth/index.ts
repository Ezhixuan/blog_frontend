// 用户认证相关API
import request from '../../../utils/core/request';
import type { 
  UserLoginData, 
  UserRegisterData, 
  UserEditData,
  UserInfoResponse,
  TokenInfoResponse,
  BooleanResponse 
} from '../../../types';

/**
 * 用户登录
 */
export function login(data: UserLoginData): Promise<TokenInfoResponse> {
  return request.post('/api/user/login', data);
}

/**
 * 用户注册
 */
export function register(data: UserRegisterData): Promise<BooleanResponse> {
  return request.post('/api/user/register', data);
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<UserInfoResponse> {
  return request.get('/api/user/info');
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: UserEditData): Promise<BooleanResponse> {
  return request.post('/api/user/edit', data);
}

/**
 * 用户登出
 */
export function logout(): Promise<BooleanResponse> {
  return request.post('/api/user/logout');
}

/**
 * 修改密码
 */
export function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<BooleanResponse> {
  return request.post('/api/user/changePassword', data);
} 