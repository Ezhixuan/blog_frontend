import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import message from "@/utils/helpers/message";
import {
  doSubmitArticle,
  getArticleCategoryList,
  getArticleTagList,
  submitCategory,
  submitTag,
  deleteTag,
  deleteCategory,
} from "@/api/articleController";
import { upload, getPictureList } from "@/api/pictureController";
import { mockGenerateBlogContent } from "@/api/ai";
import { useAsyncOperation } from "./useAsyncOperation";
import { PICTURE_TYPES } from "@/utils/constants/pictureTypes";
import type { ArticleCategory, ArticleTag, PictureUpload } from "@/types";

export function useArticleForm() {
  const router = useRouter();

  // 文章基本信息
  const title = ref("");
  const content = ref("");
  const summary = ref("");
  const categoryId = ref<number | undefined>(undefined);
  const tagIds = ref<number[]>([]);
  const status = ref(1); // 默认发布状态: 1-发布, 0-草稿
  const coverUrl = ref(""); // 封面图片URL
  const articleId = ref<string | undefined>(undefined); // 文章ID，编辑时使用
  const wordCount = ref(0); // 字数统计
  // 分类相关状态
  const categories = ref<ArticleCategory[]>([]);
  const newCategoryName = ref("");
  const showCategoryForm = ref(false);

  // 标签相关状态
  const tags = ref<ArticleTag[]>([]);
  const newTagName = ref("");
  const showTagForm = ref(false);
  const tagNames = ref<string[]>([]);  // 添加标签名称数组

  // UI状态
  const contentExpanded = ref(false);
  const formVisible = ref(false);
  const activeSection = ref("");
  const animations = reactive<Record<string, boolean>>({
    title: false,
    summary: false,
    category: false,
    tags: false,
    status: false,
    content: false,
  });

  // 图片上传相关
  const isUploading = ref(false);

  const pictureList = ref<PictureUpload[]>([]);
  const isPictureModalVisible = ref(false);
  const isFetchingPictures = ref(false);
  const currentPictureType = ref<number>(PICTURE_TYPES.COVER); // 当前图片选择的类型
  
  const activeUploadHandler = ref<Function | string | null>(null);

  const fetchPictureList = async (type?: number) => {
    try {
      isFetchingPictures.value = true;
      const params: any = { current: 1, pageSize: 50 };
      if (type) {
        params.type = type;
      }
      const res = await getPictureList(params);
      if (res.data) {
        pictureList.value = res.data.data || [];
      }
    } catch (error) {
      console.error("获取图片列表失败:", error);
      message.error("获取图片列表失败");
    } finally {
      isFetchingPictures.value = false;
    }
  };

  const showPictureModal = async (type: number = PICTURE_TYPES.COVER) => {
    currentPictureType.value = type;
    isPictureModalVisible.value = true;
    await fetchPictureList(type);
  };

  // 异步操作封装
  const { isLoading, execute: submitArticle } = useAsyncOperation(
    async (articleData) => {
      const result = await doSubmitArticle(articleData);
      if (result.code === 0) {
        router.push("/blogs");
      }
      return result;
    },
    { successMessage: "博客提交成功", errorMessage: "博客提交失败" }
  );

  const { isLoading: isLoadingCategories, execute: fetchCategories } =
    useAsyncOperation(
      async () => {
        const res = await getArticleCategoryList();
        if (res.data) {
          categories.value = res.data;
        }
        return res;
      },
      { errorMessage: "获取分类列表失败" }
    );

  const { isLoading: isLoadingTags, execute: fetchTags } = useAsyncOperation(
    async () => {
      const res = await getArticleTagList();
      if (res.data) {
        tags.value = res.data;
      }
      return res;
    },
    { errorMessage: "获取标签列表失败" }
  );

  const { isLoading: isAddingCategory, execute: addCategory } =
    useAsyncOperation(
      async (name: string) => {
        if (!name.trim()) {
          message.warning("分类名称不能为空");
          return null;
        }

        const res = await submitCategory(name);
        if (res.code === 0) {
          // 重新获取分类列表
          await fetchCategories();
          newCategoryName.value = "";
          showCategoryForm.value = false;
        }
        return res;
      },
      { successMessage: "分类添加成功", errorMessage: "添加分类失败" }
    );

  const { isLoading: isAddingTag, execute: addTag } = useAsyncOperation(
    async (name: string) => {
      if (!name.trim()) {
        message.warning("标签名称不能为空");
        return null;
      }

                      const res = await submitTag(name);
        if (res.code === 0) {
          // 重新获取标签列表
          await fetchTags();
          newTagName.value = "";
          showTagForm.value = false;
        }
      return res;
    },
    { successMessage: "标签添加成功", errorMessage: "添加标签失败" }
  );

  const { isLoading: isGenerating, execute: generateContent } =
    useAsyncOperation(
      async (title: string) => {
        if (!title) {
          message.warning("请先填写博客标题");
          return null;
        }

        const response = await mockGenerateBlogContent(title);
        if (response.data && response.data.code === 0) {
          content.value = response.data.data;
        }
        return response;
      },
      {
        successMessage: "内容生成成功，请根据需要修改完善",
        errorMessage: "AI生成内容失败",
      }
    );

  // 添加新分类
  const addNewCategory = () => addCategory(newCategoryName.value);

  // 添加新标签
  const addNewTag = () => addTag(newTagName.value);

  // 使用AI生成博客内容
  const handleGenerateContent = () => generateContent(title.value);

  // 上传图片方法
const handleImageUpload = async (file: File, type: number = PICTURE_TYPES.CONTENT) => {
  isUploading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type.toString());

    const response = await upload(formData);

    if (response.code === 0 && response.data) {
      const imageUrl = response.data;
      message.success("图片上传成功");
      
      // 添加到图片列表
      pictureList.value.unshift({
        id: Date.now(),
        url: imageUrl,
        name: file.name,
        type: type
      });
      
      return imageUrl;
    } else {
      throw new Error(response.message || "上传失败");
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    message.error("图片上传失败");
    throw error;
  } finally {
    isUploading.value = false;
  }
};

  // 修改为 Markdown 编辑器图片选择处理
  const handleSelectImageForMarkdown = async () => {
    // 设置为内容图片类型
    currentPictureType.value = PICTURE_TYPES.CONTENT;
    activeUploadHandler.value = 'markdown'; // 标记为markdown插入
    isPictureModalVisible.value = true;
    await fetchPictureList(PICTURE_TYPES.CONTENT);
  };
  
  // 修改 selectPicture 方法
  const selectPicture = (url: string) => {
    if (activeUploadHandler.value === 'markdown') {
      // 通过事件通知父组件插入图片到 Markdown 编辑器
      // 父组件需要通过 ref 调用 MarkdownEditor 的 insertImage 方法
      if (typeof window !== 'undefined') {
        // 发送自定义事件到父组件
        window.dispatchEvent(new CustomEvent('insertImageToMarkdown', { 
          detail: { url, altText: '图片' } 
        }));
      }
    } else {
      // 如果是封面图片上传
      coverUrl.value = url;
    }
    isPictureModalVisible.value = false;
    activeUploadHandler.value = null; // 重置
  };

  // 移除封面图片
  const removeCoverImage = () => {
    coverUrl.value = "";
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!title.value || !content.value) {
      message.warning("请填写完整信息");
      return;
    }

    if (!categoryId.value) {
      message.warning("请选择博客分类");
      return;
    }

    await submitArticle({
      id: articleId.value, // 如果是编辑模式，传递文章ID
      title: title.value,
      content: content.value,
      summary: summary.value,
      categoryId: categoryId.value,
      tagIds: tagIds.value.join(","),
      status: status.value,
      cover: coverUrl.value, // 添加封面图片URL
      wordCount: wordCount.value,
    });
  };

  // 取消操作
  const handleCancel = () => {
    // 返回上一页
    router.back();
  };

  // 初始化动画效果
  const initAnimations = () => {
    setTimeout(() => {
      formVisible.value = true;

      // 依次触发各个表单项的动画
      const sections = [
        "title",
        "summary",
        "category",
        "tags",
        "status",
        "content",
      ];
      sections.forEach((section, index) => {
        setTimeout(() => {
          animations[section] = true;
        }, index * 150);
      });
    }, 100);
  };

  // 删除标签
  const deleteTagFunction = async (tagId: number | undefined) => {
    if (tagId === undefined) return;

    try {
      await deleteTag(tagId);
      tags.value = tags.value.filter((tag) => tag.id !== tagId);
      // 如果删除的标签正在被选中，也从选择中移除
      tagIds.value = tagIds.value.filter((id) => id !== tagId);
      message.success("标签删除成功");
    } catch (error) {
      message.error("标签删除失败");
    }
  };

  // 删除分类
  const deleteCategoryFunction = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      await deleteCategory(id);
      categories.value = categories.value.filter(
        (category) => category.id !== id
      );
      // 如果删除的分类正在被选中，清空选择
      if (id === categoryId.value) {
        categoryId.value = undefined;
      }
      message.success("分类删除成功");
    } catch (error) {
      message.error("分类删除失败");
    }
  };

  // 初始化文章数据（编辑模式）
  const initArticleData = (id: string, data: any) => {
    articleId.value = id;
    title.value = data.title || "";
    content.value = data.content || "";
    summary.value = data.summary || "";
    categoryId.value = data.categoryId;
    tagIds.value = data.tagIds || [];
    status.value = data.status || 1;
    coverUrl.value = data.coverUrl || "";

    // 保存标签名称，用于显示
    tagNames.value = data.tagNames || [];

    // 如果有分类名称和标签名称，预先处理选择项
    const categoryName = data.categoryName;
    const tagNamesList = data.tagNames || [];

    // 当分类和标签数据加载完成后，设置正确的显示
    if (categoryName && categories.value.length > 0) {
      // 如果找不到对应的分类ID，但有分类名称，则创建一个临时分类
      if (!categories.value.some((c) => c.id === categoryId.value)) {
        console.log(
          `未找到ID为${categoryId.value}的分类，使用名称${categoryName}进行展示`
        );
        // 这里不添加到categories，只是为了UI展示，实际提交时仍使用服务器的分类ID
      }
    }

    if (
      tagNamesList.length > 0 &&
      tagIds.value.length > 0 &&
      tags.value.length > 0
    ) {
      // 如果有标签ID和名称，但在现有标签中找不到，先展示这些名称
      console.log(
        `设置标签展示，标签ID:${tagIds.value.join(",")}, 标签名称:${tagNamesList.join(",")}`
      );
    }

    // 展开内容编辑区
    contentExpanded.value = true;
    // 确保表单可见
    formVisible.value = true;
    // 立即激活所有动画
    Object.keys(animations).forEach((key) => {
      animations[key] = true;
    });
  };

  watch(content, async () => {
    await nextTick(); // 等待 DOM 更新
    const footerSpan = document.querySelector(".md-editor-footer-item span");
    if (footerSpan) {
      console.log("footerSpan", footerSpan);
      const match = footerSpan.textContent?.match(/\d+/);
      wordCount.value = match ? parseInt(match[0]) : 0;
    }
  });

  // 页面加载时初始化
  onMounted(() => {
    fetchCategories();
    fetchTags();
    initAnimations();
  });

  return {
    // 表单数据
    title,
    content,
    summary,
    categoryId,
    tagIds,
    status,
    coverUrl,
    articleId,

    // 分类相关
    categories,
    newCategoryName,
    showCategoryForm,
    isLoadingCategories,
    isAddingCategory,
    addNewCategory,

    // 标签相关
    tags,
    tagNames,  // 添加到返回对象
    newTagName,
    showTagForm,
    isLoadingTags,
    isAddingTag,
    addNewTag,

    // 图片上传相关
    isUploading,
    handleImageUpload,
    handleSelectImageForMarkdown,
    removeCoverImage,
    pictureList,
    isPictureModalVisible,
    isFetchingPictures,
    fetchPictureList,
    showPictureModal,
    selectPicture,

    // UI状态
    contentExpanded,
    formVisible,
    activeSection,
    animations,

    // 操作状态
    isLoading,
    isGenerating,

    // 方法
    handleGenerateContent,
    handleSubmit,
    handleCancel,
    deleteTagFunction,
    deleteCategoryFunction,
    initArticleData
  };
}
