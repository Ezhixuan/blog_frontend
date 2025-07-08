// 博客相关API
import request from '../../../utils/core/request';
import type {
  ArticleSubmitData,
  ArticleQueryParams,
  ArticleInfoResponse,
  ArticleListResponse,
  CategoryListResponse,
  TagListResponse,
  BooleanResponse,
  OperationById,
  CountVoResponse
} from '../../../types';

// ============= 文章相关 =============
/**
 * 获取文章列表
 */
export function getArticleList(data: ArticleQueryParams): Promise<ArticleListResponse> {
  return request.post('/article/list', data);
}

/**
 * 获取文章详情
 */
export function getArticleById(id: string): Promise<ArticleInfoResponse> {
  return request.get(`/article/${id}`);
}

/**
 * 提交文章
 */
export function submitArticle(data: ArticleSubmitData): Promise<BooleanResponse> {
  return request.post('/article', data);
}

/**
 * 更新文章
 */
export function updateArticle(id: string, data: Partial<ArticleSubmitData>): Promise<BooleanResponse> {
  return request.put(`/article/${id}`, data);
}

/**
 * 删除文章
 */
export function deleteArticle(id: number): Promise<BooleanResponse> {
  return request.delete(`/article/${id}`);
}

/**
 * 点赞/取消点赞文章
 */
export function thumbArticle(data: OperationById): Promise<BooleanResponse> {
  return request.post('/article/thumb', data);
}

// ============= 分类相关 =============
/**
 * 获取分类列表
 */
export function getCategoryList(): Promise<CategoryListResponse> {
  return request.get('/category/list');
}

/**
 * 添加分类
 */
export function addCategory(name: string): Promise<BooleanResponse> {
  return request.put(`/category/${name}`);
}

/**
 * 删除分类
 */
export function deleteCategory(id: number): Promise<BooleanResponse> {
  return request.delete(`/category/${id}`);
}

/**
 * 获取分类数量
 */
export function getCategoryCount(): Promise<CountVoResponse> {
  return request.get('/category/count');
}

// ============= 标签相关 =============
/**
 * 获取标签列表
 */
export function getTagList(): Promise<TagListResponse> {
  return request.get('/tag/list');
}

/**
 * 添加标签
 */
export function addTag(name: string): Promise<BooleanResponse> {
  return request.put(`/tag/${name}`);
}

/**
 * 删除标签
 */
export function deleteTag(id: number): Promise<BooleanResponse> {
  return request.delete(`/tag/${id}`);
} 

/**
 * 获取标签数量
 */
export function getTagCount(): Promise<CountVoResponse> {
  return request.get('/tag/count');
}