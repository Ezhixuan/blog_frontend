// API 统一导出文件
// 提供新的模块化API和旧API的向后兼容

// 导入新的模块化API
export * from './modules';

// 向后兼容：重新导出旧的API结构
import * as authApi from './modules/auth';
import * as blogApi from './modules/blog';
import * as memoApi from './modules/memo';
import * as commonApi from './modules/common';

// 模拟旧的控制器结构，保持向后兼容
const sysUserController = {
  login: authApi.login,
  register: authApi.register,
  getUserInfo: authApi.getUserInfo,
  updateUserInfo: authApi.updateUserInfo,
  logout: authApi.logout,
  changePassword: authApi.changePassword,
};

const articleController = {
  getArticleList: blogApi.getArticleList,
  getArticleById: blogApi.getArticleById,
  submitArticle: blogApi.submitArticle,
  updateArticle: blogApi.updateArticle,
  deleteArticle: blogApi.deleteArticle,
  getCategoryList: blogApi.getCategoryList,
  addCategory: blogApi.addCategory,
  deleteCategory: blogApi.deleteCategory,
  getTagList: blogApi.getTagList,
  addTag: blogApi.addTag,
  deleteTag: blogApi.deleteTag,
};

const memoController = {
  getDeckList: memoApi.getDeckList,
  createDeck: memoApi.createDeck,
  updateDeck: memoApi.updateDeck,
  deleteDeck: memoApi.deleteDeck,
  getCardList: memoApi.getCardList,
  createCard: memoApi.createCard,
  updateCard: memoApi.updateCard,
  deleteCard: memoApi.deleteCard,
  operateCard: memoApi.operateCard,
  getStudyTest: memoApi.getStudyTest,
};

const pictureController = {
  uploadPicture: commonApi.uploadPicture,
  getPictureList: commonApi.getPictureList,
  deletePicture: commonApi.deletePicture,
};

const mainController = {
  healthCheck: commonApi.healthCheck,
  getSystemInfo: commonApi.getSystemInfo,
};

// 默认导出（保持向后兼容）
export default {
  sysUserController,
  articleController,
  memoController,
  pictureController,
  mainController,
};

// 新的推荐导出方式
export {
  authApi,
  blogApi,
  memoApi,
  commonApi,
};
