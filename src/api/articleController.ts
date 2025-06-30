// 临时向后兼容文件 - 重新导出新API模块中的函数
export { 
  getArticleById as getArticleInfo,
  submitArticle as doSubmitArticle,
  getCategoryList as getArticleCategoryList,
  getTagList as getArticleTagList,
  addCategory as doSubmitCategory,
  addTag as doSubmitTag,
  getArticleList as getArticlePageList,
  deleteCategory,
  deleteTag,
  addCategory as submitCategory,
  addTag as submitTag,
  thumbArticle as doThumb
} from './modules/blog';

// 需要添加一些还没有实现的函数
import { blogApi } from './modules';

export const getCategoryCount = () => {
  // 临时实现
  return blogApi.getCategoryList();
};

export const getTagCount = () => {
  // 临时实现
  return blogApi.getTagList();
}; 