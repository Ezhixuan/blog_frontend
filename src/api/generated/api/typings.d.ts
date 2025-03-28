declare namespace API {
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

  type UserEditDTO = {
    id?: number;
    password?: string;
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
