// 博客业务相关类型定义
import type { 
  ArticleInfo, 
  ArticleSubmitData, 
  ArticleQueryParams,
  ArticleCategory,
  ArticleCategoryCount,
  ArticleTag,
  ArticleTagCount 
} from '../api';

// 重新导出基础类型
export type { 
  ArticleInfo, 
  ArticleSubmitData, 
  ArticleQueryParams,
  ArticleCategory,
  ArticleCategoryCount,
  ArticleTag,
  ArticleTagCount 
};

// ============= 博客状态类型 =============
export interface BlogState {
  currentArticle: ArticleInfo | null;
  articleList: ArticleInfo[];
  categories: ArticleCategory[];
  tags: ArticleTag[];
  loading: boolean;
  error: string | null;
}

// ============= 博客编辑类型 =============
export interface BlogEditorState {
  title: string;
  content: string;
  summary: string;
  cover?: string;
  categoryId?: number;
  tagIds: number[];
  status: ArticleStatus;
  isDraft: boolean;
  autoSave: boolean;
}

export enum ArticleStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  ARCHIVED = 2
}

// ============= 博客展示类型 =============
export interface BlogDisplayOptions {
  showSummary: boolean;
  showCover: boolean;
  showTags: boolean;
  showCategory: boolean;
  showStats: boolean;
  layout: 'list' | 'grid' | 'masonry';
}

export interface BlogFilter {
  category?: number;
  tags?: number[];
  dateRange?: [string, string];
  status?: ArticleStatus;
  sortBy: 'createTime' | 'updateTime' | 'viewCount' | 'likeCount';
  sortOrder: 'asc' | 'desc';
}

// ============= 博客统计类型 =============
export interface BlogStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  categoriesCount: number;
  tagsCount: number;
}

// ============= 博客搜索类型 =============
export interface BlogSearchParams {
  keyword: string;
  searchIn: ('title' | 'content' | 'summary')[];
  categories?: number[];
  tags?: number[];
  dateRange?: [string, string];
}

export interface BlogSearchResult {
  articles: ArticleInfo[];
  total: number;
  highlight: {
    [articleId: number]: {
      title?: string;
      content?: string;
      summary?: string;
    };
  };
} 