import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // API的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据后端的约定对响应数据进行处理
    if (res.code === 200) {
      return res.data
    }
    // 处理其他状态码
    console.error('Response error:', res.message || 'Error')
    return Promise.reject(new Error(res.message || 'Error'))
  },
  (error) => {
    // 处理HTTP错误状态
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页面
          localStorage.removeItem('token')
          // 可以在这里添加路由跳转逻辑
          break
        case 403:
          // 权限不足
          console.error('No permission')
          break
        case 404:
          // 请求的资源不存在
          console.error('Resource not found')
          break
        case 500:
          // 服务器错误
          console.error('Server error')
          break
        default:
          console.error(`HTTP error: ${error.response.status}`)
      }
    }
    return Promise.reject(error)
  }
)

export default service