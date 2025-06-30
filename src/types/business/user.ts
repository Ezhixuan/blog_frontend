// 用户业务相关类型定义
import type { UserInfo } from '../api';

// ============= 用户状态类型 =============
export interface UserState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  token: string | null;
  permissions: string[];
}

export interface UserProfile {
  id: number;
  username: string;
  avatar?: string;
  email: string;
  profile?: string;
  role: string;
  createTime: string;
  lastLoginTime?: string;
}

// ============= 用户操作类型 =============
export interface LoginFormData {
  userAccount: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  userAccount: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  username?: string;
  avatar?: string;
  profile?: string;
  email?: string;
}

// ============= 用户权限类型 =============
export type UserRole = 'admin' | 'user' | 'guest';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

// ============= 用户设置类型 =============
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    emailVisible: boolean;
  };
}

// 重新导入UserInfo以避免重复定义
export type { UserInfo } from '../api'; 