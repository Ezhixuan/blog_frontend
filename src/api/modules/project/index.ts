// 项目相关API
import request from '@/utils/core/request'
import type {
  ProjectCreateDTO,
  ProjectEditDTO,
  ProjectListResponse,
  ProjectQueryDTO,
  ProjectQueryVO
} from '@/types/api.ts'

/**
 * 获取项目列表
 */
export function getProjects(params: ProjectQueryDTO): Promise<ProjectListResponse> {
  return request.get('/projects', { params });
}

/**
 * 获取项目详情
 */
export function getProject(id: string): Promise<ProjectQueryVO> {
  return request.get(`/projects/${id}`);
}

/**
 * 创建项目
 */
export function createProject(data: Omit<ProjectCreateDTO, 'id' | 'createdTime' | 'stars' | 'views'>): Promise<ProjectQueryVO> {
  return request.post('/projects', data);
}

/**
 * 更新项目
 */
export function updateProject(data: Partial<ProjectEditDTO>): Promise<ProjectQueryVO> {
  return request.put(`/projects`, data);
}

/**
 * 删除项目
 */
export function deleteProject(id: string): Promise<boolean> {
  return request.delete(`/projects/${id}`);
}

/**
 * 获取技术栈列表
 */
export function getTechnologies(): Promise<string[]> {
  return request.get('/projects/technologies');
}

/**
 * 设置项目为推荐
 */
export function doFeatured(id: string): Promise<boolean> {
  return request.put(`/projects/featured/${id}`);
}
