import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfo {
  id: number;
  username: string;
  avatar?: string;
  email?: string;
  role?: string;
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const isLoggedIn = ref(false);

  // 设置用户信息
  function setUserInfo(info: UserInfo | null) {
    userInfo.value = info;
    isLoggedIn.value = !!info;
  }

  // 设置令牌
  function setToken(newToken: string | null) {
    token.value = newToken;
    localStorage.setItem('token', newToken || '');
  }

  // 登录
  function login(userData: { token: string; userInfo: UserInfo }) {
    setToken(userData.token);
    setUserInfo(userData.userInfo);
  }

  // 登出
  function logout() {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenName');
    localStorage.removeItem('loginId');
    localStorage.removeItem('isLogin');
  }

  // 初始化
  function init() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      // 在实际应用中，这里应当使用令牌从服务器获取用户信息
      // 为了演示，这里使用模拟数据
      userInfo.value = {
        id: 1,
        username: '当前用户',
      };
      isLoggedIn.value = true;
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    setToken,
    login,
    logout,
    init
  };
}); 