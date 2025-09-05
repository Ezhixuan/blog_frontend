// 全局类型定义
declare global {
  interface Window {
    // 扩展window对象类型
  }

  // 声明API命名空间，兼容旧代码
  namespace API {
    // 用户相关类型
    interface SaTokenInfo {
      tokenName: string;
      tokenValue: string;
      isLogin: boolean;
      loginId: Record<string, any>;
      loginType: string;
      tokenTimeout: number;
      sessionTimeout: number;
      tokenSessionTimeout: number;
      tokenActiveTimeout: number;
      loginDeviceType: string;
      tag: string;
    }

    interface UserInfoVO {
      id: string;
      userAccount: string;
      username: string;
      avatar?: string;
      profile?: string;
      email?: string;
      createTime: string;
      role: string;
    }

    // 文章相关类型
    interface ArticlePageVO {
      id: string;
      title: string;
      userId: string;
      summary: string;
      cover?: string;
      categoryId: string;
      categoryName: string;
      tagMap: Record<string, any>;
      wordCount: number;
      viewCount: number;
      likeCount: number;
      commentCount: number;
      status: number;
      createTime: string;
      updateTime: string;
    }
  }
}

// 通用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

// 分页相关类型
export interface PaginationParams {
  current: number;
  pageSize: number;
  sortOrder: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API响应通用类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 表单相关类型
export interface FormRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (rule: any, value: any) => Promise<void>;
}

export interface FormRules {
  [key: string]: FormRule[];
}

// 菜单类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

// 主题类型
export type ThemeType = 'light' | 'dark';

// 状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export {};
