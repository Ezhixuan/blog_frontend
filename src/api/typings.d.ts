declare namespace API {
  type ArticleCategoryCountVO = {
    id?: number;
    name?: string;
    count?: number;
  };

  type ArticleCategoryVO = {
    id?: number;
    name?: string;
  };

  type ArticleInfoVO = {
    id?: number;
    title?: string;
    userId?: number;
    summary?: string;
    cover?: string;
    categoryId?: number;
    categoryName?: string;
    tagMap?: Record<string, any>;
    wordCount?: number;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    status?: number;
    createTime?: string;
    updateTime?: string;
    content?: string;
  };

  type ArticlePageVO = {
    id?: number;
    title?: string;
    userId?: number;
    summary?: string;
    cover?: string;
    categoryId?: number;
    categoryName?: string;
    tagMap?: Record<string, any>;
    wordCount?: number;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    status?: number;
    createTime?: string;
    updateTime?: string;
  };

  type ArticleQueryDTO = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    summary?: string;
    categoryName?: string;
    tagName?: string;
    ids?: number[];
    tagIds?: number[];
    categoryIds?: number[];
  };

  type ArticleSubmitDTO = {
    title?: string;
    summary?: string;
    cover?: string;
    categoryId?: number;
    tagIds?: string;
    status?: number;
    content?: string;
  };

  type ArticleTagCountVO = {
    id?: number;
    name?: string;
    count?: number;
  };

  type ArticleTagVO = {
    id?: number;
    name?: string;
  };

  type BaseResponseArticleCategoryVO = {
    code?: number;
    data?: ArticleCategoryVO;
    message?: string;
  };

  type BaseResponseArticleInfoVO = {
    code?: number;
    data?: ArticleInfoVO;
    message?: string;
  };

  type BaseResponseArticleTagVO = {
    code?: number;
    data?: ArticleTagVO;
    message?: string;
  };

  type BaseResponseListArticleCategoryCountVO = {
    code?: number;
    data?: ArticleCategoryCountVO[];
    message?: string;
  };

  type BaseResponseListArticleCategoryVO = {
    code?: number;
    data?: ArticleCategoryVO[];
    message?: string;
  };

  type BaseResponseListArticleTagCountVO = {
    code?: number;
    data?: ArticleTagCountVO[];
    message?: string;
  };

  type BaseResponseListArticleTagVO = {
    code?: number;
    data?: ArticleTagVO[];
    message?: string;
  };

  type BaseResponsePageResponseArticlePageVO = {
    code?: number;
    data?: PageResponseArticlePageVO;
    message?: string;
  };

  type BaseResponseSaTokenInfo = {
    code?: number;
    data?: SaTokenInfo;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUserInfoVO = {
    code?: number;
    data?: UserInfoVO;
    message?: string;
  };

  type getArticleInfoParams = {
    id: string;
  };

  type PageResponseArticlePageVO = {
    data?: ArticlePageVO[];
    total?: number;
  };

  type SaTokenInfo = {
    tokenName?: string;
    tokenValue?: string;
    isLogin?: boolean;
    loginId?: Record<string, any>;
    loginType?: string;
    tokenTimeout?: number;
    sessionTimeout?: number;
    tokenSessionTimeout?: number;
    tokenActiveTimeout?: number;
    loginDeviceType?: string;
    tag?: string;
  };

  type submitCategoryParams = {
    name: string;
  };

  type submitTagParams = {
    name: string;
  };

  type UserEditDTO = {
    password?: string;
    oldPassword?: string;
    username?: string;
    avatar?: string;
    profile?: string;
    email?: string;
  };

  type UserInfoVO = {
    id?: number;
    userAccount?: string;
    username?: string;
    avatar?: string;
    profile?: string;
    email?: string;
    createTime?: string;
    role?: string;
  };

  type UserLoginDTO = {
    userAccount?: string;
    password?: string;
  };

  type UserRegisterDTO = {
    userAccount?: string;
    password?: string;
    confirmPassword?: string;
  };
}
