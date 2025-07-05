// API模块统一导出
export * as authApi from './auth';
export * as blogApi from './blog';
export * as memoApi from './memo';
export * as commonApi from './common';
export * as projectApi from './project';

// 也可以单独导出具体的函数，方便使用
export {
  // 认证相关
  login,
  register,
  getUserInfo,
  updateUserInfo,
  logout,
  changePassword
} from './auth';

export {
  // 博客相关
  getArticleList,
  getArticleById,
  submitArticle,
  updateArticle,
  deleteArticle,
  getCategoryList,
  addCategory,
  deleteCategory,
  getTagList,
  addTag,
  deleteTag
} from './blog';

export {
  // 记忆卡相关
  getDeckList,
  createDeck,
  updateDeck,
  deleteDeck,
  getCardList,
  createCard,
  updateCard,
  deleteCard,
  operateCard,
  getStudyTest
} from './memo';

export {
  // 公共模块相关
  uploadPicture,
  getPictureList,
  deletePicture,
  healthCheck,
  getSystemInfo
} from './common';

export {
  // 项目相关
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  incrementViews,
  getTechnologies
} from './project'; 