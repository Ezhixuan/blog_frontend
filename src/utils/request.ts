import { useUserStore } from '@/stores/user';
import messageService from '@/utils/message';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 错误码枚举
enum ErrorCode {
  SUCCESS = 0,
  PARAMS_ERROR = 40000,
  NOT_LOGIN_ERROR = 40100,
  NO_AUTH_ERROR = 40101,
  NOT_FOUND_ERROR = 40400,
  FORBIDDEN_ERROR = 40300,
  SYSTEM_ERROR = 50000,
  OPERATION_ERROR = 50001
}

// 需要登录才能访问的路由路径前缀
const PROTECTED_ROUTES = [
  '/blog/edit',
];

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
    
    if (token && tokenName && config.headers) {
      config.headers[tokenName] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
)

// 判断当前路径是否需要登录权限
const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

// 处理未登录情况
const handleNotLogin = () => {
  // 防止重复处理和无限循环
  if (localStorage.getItem('redirecting') === 'true') {
    return;
  }
  
  // 设置重定向标记
  localStorage.setItem('redirecting', 'true');
  
  // 使用pinia store清除用户信息
  const userStore = useUserStore();
  userStore.logout();
  userStore.setUserInfo(null);
  
  // 清除其他可能存在的登录相关信息
  localStorage.removeItem('tokenName');
  localStorage.removeItem('loginId');
  localStorage.removeItem('isLogin');
  
  // 检查当前是否已在登录页或主页
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/login') {
    // 延迟跳转，给其他处理一些时间
    setTimeout(() => {
      // 如果是受保护的路由，重定向到首页
      if (isProtectedRoute(currentPath)) {
        window.location.href = '/';
      } else {
        // 如果不是受保护的路由，强制刷新当前页面以更新UI
        window.location.reload();
      }
      
      // 跳转后清除标记
      setTimeout(() => {
        localStorage.removeItem('redirecting');
      }, 1000);
    }, 100);
  } else {
    // 已在登录页或主页，只刷新页面
    window.location.reload();
    
    // 清除标记
    setTimeout(() => {
      localStorage.removeItem('redirecting');
    }, 1000);
  }
};

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    
    // 请求成功
    if (res.code === ErrorCode.SUCCESS) {
      return response;
    }
    
    // 处理各种错误码
    switch (res.code) {
      case ErrorCode.NOT_LOGIN_ERROR:
        console.log("用户未登录");
        messageService.error(res.message || "请先登录");
        handleNotLogin();
        break;
      case ErrorCode.NO_AUTH_ERROR:
        messageService.error(res.message || "无权限访问");
        break;
      case ErrorCode.PARAMS_ERROR:
        messageService.error(res.message || "请求参数错误");
        break;
      case ErrorCode.NOT_FOUND_ERROR:
        messageService.error(res.message || "请求数据不存在");
        break;
      case ErrorCode.FORBIDDEN_ERROR:
        messageService.error(res.message || "禁止访问");
        break;
      case ErrorCode.SYSTEM_ERROR:
        messageService.error(res.message || "系统内部异常");
        break;
      case ErrorCode.OPERATION_ERROR:
        messageService.error(res.message || "操作失败");
        break;
      default:
        messageService.error(res.message || "未知错误");
    }
    
    return Promise.reject(new Error(res.message || "请求失败"));
  },
  (error) => {
    // 处理HTTP错误状态
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          messageService.error("用户未授权");
          handleNotLogin();
          break;
        case 403:
          messageService.error("禁止访问");
          break;
        case 404:
          messageService.error("请求资源不存在");
          break;
        case 500:
          messageService.error("服务器内部错误");
          break;
        default:
          messageService.error(`请求错误: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出但未收到响应
      messageService.error("服务器无响应");
    } else {
      // 请求配置错误
      messageService.error(`请求异常: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
)

export default service