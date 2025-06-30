/**
 * 图片类型常量
 */
export const PICTURE_TYPES = {
  /** 博客内容图片 */
  CONTENT: 1,
  /** 博客封面图片 */
  COVER: 2,
  /** 博客用户头像 */
  AVATAR: 3,
} as const;

/**
 * 图片类型描述
 */
export const PICTURE_TYPE_DESC = {
  [PICTURE_TYPES.CONTENT]: '博客内容图片',
  [PICTURE_TYPES.COVER]: '博客封面图片',
  [PICTURE_TYPES.AVATAR]: '博客用户头像',
} as const;

/**
 * 图片类型列表
 */
export const PICTURE_TYPE_OPTIONS = [
  { value: PICTURE_TYPES.CONTENT, label: PICTURE_TYPE_DESC[PICTURE_TYPES.CONTENT] },
  { value: PICTURE_TYPES.COVER, label: PICTURE_TYPE_DESC[PICTURE_TYPES.COVER] },
  { value: PICTURE_TYPES.AVATAR, label: PICTURE_TYPE_DESC[PICTURE_TYPES.AVATAR] },
] as const; 