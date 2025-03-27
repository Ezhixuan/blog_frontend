import request from '../utils/request'
import { ApiResponse, Project } from './types'

// 获取项目列表
export function getProjectList() {
  return request<ApiResponse<Project[]>>({
    url: '/api/projects',
    method: 'get',
  })
}

// 获取项目详情
export function getProjectDetail(id: string) {
  return request<ApiResponse<Project>>({
    url: `/api/projects/${id}`,
    method: 'get',
  })
}