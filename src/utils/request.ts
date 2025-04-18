import messageService from '@/utils/message';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080', // API的base_url
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');
    const tokenName = localStorage.getItem("tokenName");
    console.log("token  = " + token);
    if (token && tokenName) {
      config.headers = {
        ...config.headers,
        [tokenName]: `Bearer ${token}`,
      };
    }
    return config;
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
    console.log('response', response)
    const res = response
    // 这里可以根据后端的约定对响应数据进行处理
    if (res.data.code === 0) {
      return res
    }
    // 处理其他状态码
    console.error('Response error:', res.data.message || 'Error')
    if (res.data.code !== 40100 || res.data.message !== "未登录") {
      messageService.error(res.data.message || 'Error')
    }
    return Promise.reject(new Error(res.data.message || 'Error'))
  },
  (error) => {
    // 处理HTTP错误状态
    if (error.response) {
      switch (error.response.status) {
        case 40100:
          // 未授权，清除所有登录信息并跳转到首页
          localStorage.removeItem('token');
          localStorage.removeItem('tokenName');
          localStorage.removeItem('loginId');
          localStorage.removeItem('isLogin');
          window.location.href = '/';
          break;
        case 40300:
          // 权限不足
          console.error('No permission')
          break
        case 40400:
          // 请求的资源不存在
          console.error('Resource not found')
          break
        case 50000:
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