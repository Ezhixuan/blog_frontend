// 通用响应类型
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应数据
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 博客文章类型
export interface BlogPost {
  id: string
  title: string
  content: string
  summary: string
  coverImage?: string
  author: string
  publishDate: string
  tags: string[]
  viewCount: number
  likeCount: number
}

// 友链类型
export interface Friend {
  id: string
  name: string
  avatar: string
  description: string
  url: string
}

// 项目类型
export interface Project {
  id: string
  name: string
  description: string
  imageUrl?: string
  githubUrl?: string
  demoUrl?: string
  technologies: string[]
}