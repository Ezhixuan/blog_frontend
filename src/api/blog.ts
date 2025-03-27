import request from '../utils/request'
import { ApiResponse, BlogPost, PageParams, PageResult } from './types'

// 获取博客列表
export function getBlogList(params: PageParams) {
  return request<ApiResponse<PageResult<BlogPost>>>({
    url: '/api/blogs',
    method: 'get',
    params,
  })
}

// 获取博客详情
export function getBlogDetail(id: string) {
  return request<ApiResponse<BlogPost>>({
    url: `/api/blogs/${id}`,
    method: 'get',
  })
}

// 获取热门博客
export function getHotBlogs(limit: number = 5) {
  return request<ApiResponse<BlogPost[]>>({
    url: '/api/blogs/hot',
    method: 'get',
    params: { limit },
  })
}

// 获取博客标签
export function getBlogTags() {
  return request<ApiResponse<string[]>>({
    url: '/api/blogs/tags',
    method: 'get',
  })
}

// 根据标签获取博客
export function getBlogsByTag(tag: string, params: PageParams) {
  return request<ApiResponse<PageResult<BlogPost>>>({
    url: '/api/blogs/tag',
    method: 'get',
    params: {
      tag,
      ...params,
    },
  })
}