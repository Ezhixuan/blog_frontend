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
  OperationById
} from '../../../types';

// ============= 文章相关 =============
/**
 * 获取文章列表
 */
export function getArticleList(data: ArticleQueryParams): Promise<ArticleListResponse> {
  return request.post('/api/article/list', data);
}

/**
 * 获取文章详情
 */
export function getArticleById(id: string): Promise<ArticleInfoResponse> {
  return request.get(`/api/article/${id}`);
}

/**
 * 提交文章
 */
export function submitArticle(data: ArticleSubmitData): Promise<BooleanResponse> {
  return request.post('/api/article/submit', data);
}

/**
 * 更新文章
 */
export function updateArticle(id: string, data: Partial<ArticleSubmitData>): Promise<BooleanResponse> {
  return request.put(`/api/article/${id}`, data);
}

/**
 * 删除文章
 */
export function deleteArticle(data: OperationById): Promise<BooleanResponse> {
  return request.delete('/api/article/delete', { data });
}

// ============= 分类相关 =============
/**
 * 获取分类列表
 */
export function getCategoryList(): Promise<CategoryListResponse> {
  return request.get('/api/category/list');
}

/**
 * 添加分类
 */
export function addCategory(name: string): Promise<BooleanResponse> {
  return request.put(`/api/category/${name}`);
}

/**
 * 删除分类
 */
export function deleteCategory(id: number): Promise<BooleanResponse> {
  return request.delete(`/api/category/${id}`);
}

// ============= 标签相关 =============
/**
 * 获取标签列表
 */
export function getTagList(): Promise<TagListResponse> {
  return request.get('/api/tag/list');
}

/**
 * 添加标签
 */
export function addTag(name: string): Promise<BooleanResponse> {
  return request.put(`/api/tag/${name}`);
}

/**
 * 删除标签
 */
export function deleteTag(id: number): Promise<BooleanResponse> {
  return request.delete(`/api/tag/${id}`);
} 