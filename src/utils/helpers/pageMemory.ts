/**
 * 分页记忆工具
 * 用于记住用户浏览文章列表时的分页状态，以便从文章详情返回时恢复
 */

// 保存当前文章列表分页状态的键
const BLOG_PAGE_STATE_KEY = 'blog_page_state';

// 分页状态接口
interface PageState {
  current: number;
  pageSize: number;
  lastVisitTime: number; // 上次访问时间戳
  scrollPosition?: number; // 滚动位置
  categoryId?: string; // 分类ID
  tagId?: string;
}

/**
 * 保存当前分页状态
 * @param current 当前页码
 * @param pageSize 每页大小
 * @param scrollPosition 可选的滚动位置
 * @param categoryId 可选的分类ID
 */
export function savePageState(current: number, pageSize: number, scrollPosition?: number, categoryId?: string, tagId?: string): void {
  const pageState: PageState = {
    current,
    pageSize,
    lastVisitTime: Date.now(),
    scrollPosition,
    categoryId,
    tagId
  };
  
  localStorage.setItem(BLOG_PAGE_STATE_KEY, JSON.stringify(pageState));
  console.log('保存分页状态:', pageState);
}

/**
 * 获取保存的分页状态
 * @param maxAge 有效期（毫秒），超过此时间将返回undefined
 * @returns 保存的分页状态，如果不存在或已过期则返回undefined
 */
export function getPageState(maxAge: number = 30 * 60 * 1000): PageState | undefined {
  const stateJson = localStorage.getItem(BLOG_PAGE_STATE_KEY);
  
  if (!stateJson) {
    return undefined;
  }
  
  try {
    const pageState: PageState = JSON.parse(stateJson);
    const now = Date.now();
    
    // 如果保存的状态已经过期
    if (now - pageState.lastVisitTime > maxAge) {
      console.log('分页状态已过期');
      clearPageState();
      return undefined;
    }
    
    console.log('获取到保存的分页状态:', pageState);
    return pageState;
  } catch (error) {
    console.error('解析分页状态失败:', error);
    clearPageState();
    return undefined;
  }
}

/**
 * 清除保存的分页状态
 */
export function clearPageState(): void {
  localStorage.removeItem(BLOG_PAGE_STATE_KEY);
  console.log('清除分页状态');
}