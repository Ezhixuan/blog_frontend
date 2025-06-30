// 临时向后兼容文件 - 重新导出新API模块中的函数
export { 
  login as doLogin,
  getUserInfo as getLoginUserInfo,
  updateUserInfo as editUserInfo,
  logout as doLogout,
  register as doRegister
} from './modules/auth'; 