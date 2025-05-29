declare namespace API {
  type ArticleCategoryCountVO = {
    id?: number;
    name?: string;
    description?: string;
    count?: number;
  };

  type ArticleCategoryVO = {
    id?: number;
    name?: string;
    description?: string;
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
    id?: string;
    title?: string;
    summary?: string;
    cover?: string;
    categoryId?: number;
    tagIds?: string;
    status?: number;
    content?: string;
    wordCount?: number;
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

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
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

  type BaseResponseListMemoCardVO = {
    code?: number;
    data?: MemoCardVO[];
    message?: string;
  };

  type BaseResponsePageResponseArticlePageVO = {
    code?: number;
    data?: PageResponseArticlePageVO;
    message?: string;
  };

  type BaseResponsePageResponseMemoCardVO = {
    code?: number;
    data?: PageResponseMemoCardVO;
    message?: string;
  };

  type BaseResponsePageResponseMemoDeckVO = {
    code?: number;
    data?: PageResponseMemoDeckVO;
    message?: string;
  };

  type BaseResponsePageResponsePictureUploadVO = {
    code?: number;
    data?: PageResponsePictureUploadVO;
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

  type del1Params = {
    idOpt: OperationById;
  };

  type deleteCategoryParams = {
    id: number;
  };

  type deleteTagParams = {
    id: number;
  };

  type delParams = {
    idOpt: OperationById;
  };

  type getArticleInfoParams = {
    id: number;
  };

  type listParams = {
    queryDTO: MemoQueryDTO;
  };

  type MemoCardOperateDTO = {
    id?: number;
    useTime?: number;
    type?: number;
  };

  type MemoCardSubmitDTO = {
    deckId?: number;
    front?: string;
    back?: string;
  };

  type MemoCardVO = {
    id?: number;
    deckId?: number;
    deckName?: string;
    front?: string;
    back?: string;
  };

  type MemoDeckDTO = {
    id?: number;
    name?: string;
  };

  type MemoDeckVO = {
    id?: number;
    name?: string;
  };

  type MemoQueryDTO = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    deckId?: number;
  };

  type OperationById = {
    id?: number;
  };

  type PageResponseArticlePageVO = {
    data?: ArticlePageVO[];
    total?: number;
  };

  type PageResponseMemoCardVO = {
    data?: MemoCardVO[];
    total?: number;
  };

  type PageResponseMemoDeckVO = {
    data?: MemoDeckVO[];
    total?: number;
  };

  type PageResponsePictureUploadVO = {
    data?: PictureUploadVO[];
    total?: number;
  };

  type PictureUploadDTO = {
    id?: number;
    /** 图片类型 1.博客内容图片 2.博客封面图片 3.博客用户头像 */
    type?: number;
  };

  type PictureUploadVO = {
    id?: number;
    url?: string;
    name?: string;
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

  type testParams = {
    deckId: number;
  };

  type uploadParams = {
    uploadDTO: PictureUploadDTO;
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
