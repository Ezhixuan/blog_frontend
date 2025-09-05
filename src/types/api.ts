import type { ApiResponse, PaginationParams, PaginationResult } from './global';

// ============= 用户相关类型 =============
export interface UserInfo {
  id: string;
  userAccount: string;
  username: string;
  avatar?: string;
  profile?: string;
  email?: string;
  createTime: string;
  role: string;
}

export interface UserLoginData {
  userAccount: string;
  password: string;
}

export interface UserRegisterData {
  userAccount: string;
  password: string;
  confirmPassword: string;
}

export interface UserEditData {
  password?: string;
  oldPassword?: string;
  username?: string;
  avatar?: string;
  profile?: string;
  email?: string;
}

export interface TokenInfo {
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

// ============= 文章相关类型 =============
export interface ArticleInfo {
  id: string;
  title: string;
  userId: string;
  summary: string;
  cover?: string;
  projectId?: string;
  categoryId: string;
  categoryName: string;
  tagMap: Record<string, string>;
  wordCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: number;
  createTime: string;
  updateTime: string;
  content?: string;
}

export interface ArticleSubmitData {
  id?: string;
  projectId?: string;
  title: string;
  summary: string;
  cover?: string;
  categoryId: number;
  tagIds: string;
  status: number;
  content: string;
  wordCount: number;
}

export interface ArticleQueryParams extends PaginationParams {
  title?: string;
  summary?: string;
  categoryName?: string;
  tagName?: string;
  ids?: number[];
  tagIds?: number[];
  categoryIds?: number[];
  projectId?: string;
}

// ============= 分类和标签类型 =============
export interface ArticleCategory {
  id?: string;
  name: string;
}

export interface ArticleTag {
  id?: string;
  name: string;
}

export interface CountVo {
  id: string;
  count: number;  
}
// ============= 记忆卡相关类型 =============
export interface MemoDeck {
  id: string;
  name: string;
}

export interface MemoCard {
  id: string;
  deckId: string;
  deckName: string;
  front: string;
  back: string;
}

export interface MemoCardSubmitData {
  deckId: string;
  front: string;
  back: string;
}

export interface MemoCardOperateData {
  id: string;
  useTime: number;
  type: number;
}

export interface MemoQueryParams extends PaginationParams {
  deckId?: string;
}

// ============= 图片相关类型 =============
export interface PictureUpload {
  id?: string;
  url: string;
  name: string;
  /** 图片类型 1.博客内容图片 2.博客封面图片 3.博客用户头像 */
  type: number;
}

export interface PictureUploadData {
  id?: string;
  /** 图片类型 1.博客内容图片 2.博客封面图片 3.博客用户头像 */
  type: number;
}

export interface UploadModel {
  model: string;
  desc: string;
}

// ============= 项目相关类型 =============
export interface ProjectQueryVO {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  liveUrl: string;
  createTime: string;
  stars: number;
  views: number;
  featured: boolean;
  technologies: string[];
  hasArticles: boolean;
}

export interface ProjectQueryDTO extends PaginationParams{
  featured?: boolean;
  technology?: string;
}

export interface ProjectCreateDTO {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  liveUrl: string;
  technologies: string[];
  featured?: boolean;
}

export interface ProjectEditDTO {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  liveUrl: string;
  technologies: string[];
  featured?: boolean;
}

export interface ProjectLinkArticleVo {
  id: string;
  title: string;
}

// ============= 通用操作类型 =============
export interface OperationById {
  id: string;
}

// ============= API响应类型别名 =============
export type UserInfoResponse = ApiResponse<UserInfo>;
export type TokenInfoResponse = ApiResponse<TokenInfo>;
export type ArticleInfoResponse = ApiResponse<ArticleInfo>;
export type ArticleListResponse = ApiResponse<PaginationResult<ArticleInfo>>;
export type CategoryListResponse = ApiResponse<ArticleCategory[]>;
export type TagListResponse = ApiResponse<ArticleTag[]>;
export type MemoCardListResponse = ApiResponse<PaginationResult<MemoCard>>;
export type MemoDeckListResponse = ApiResponse<PaginationResult<MemoDeck>>;
export type PictureListResponse = ApiResponse<PaginationResult<PictureUpload>>;
export type BooleanResponse = ApiResponse<boolean>;
export type StringResponse = ApiResponse<string>;
export type ProjectListResponse = ApiResponse<PaginationResult<ProjectQueryVO>>;
export type CountVoResponse = ApiResponse<CountVo[]>;
export type ProjectLinkArticleVoResponse = ApiResponse<PaginationResult<ProjectLinkArticleVo>>;
