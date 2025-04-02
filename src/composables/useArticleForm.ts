import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import message from "@/utils/message";
import {
  doSubmitArticle,
  getArticleCategoryList,
  getArticleTagList,
  submitCategory,
  submitTag,
  deleteTag,
  deleteCategory,
} from "@/api/articleController";
import { upload } from "@/api/pictureController";
import { mockGenerateBlogContent } from "@/api/ai";
import { useAsyncOperation } from "./useAsyncOperation";

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
  const articleId = ref<number | undefined>(undefined); // 文章ID，编辑时使用

  // 分类相关状态
  const categories = ref<API.ArticleCategoryVO[]>([]);
  const newCategoryName = ref("");
  const showCategoryForm = ref(false);

  // 标签相关状态
  const tags = ref<API.ArticleTagVO[]>([]);
  const newTagName = ref("");
  const showTagForm = ref(false);

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

  // 异步操作封装
  const { isLoading, execute: submitArticle } = useAsyncOperation(
    async (articleData) => {
      const result = await doSubmitArticle(articleData);
      if (result.data?.code === 0) {
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
        if (res.data?.code === 0 && res.data?.data) {
          categories.value = res.data.data;
        }
        return res;
      },
      { errorMessage: "获取分类列表失败" }
    );

  const { isLoading: isLoadingTags, execute: fetchTags } = useAsyncOperation(
    async () => {
      const res = await getArticleTagList();
      if (res.data?.code === 0 && res.data?.data) {
        tags.value = res.data.data;
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

        const res = await submitCategory({ name });
        if (res.data?.code === 0 && res.data?.data) {
          categories.value.push(res.data.data);
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

      const res = await submitTag({ name });
      if (res.data?.code === 0 && res.data?.data) {
        tags.value.push(res.data.data);
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
        if (response.data.code === 0) {
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
  const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // 检查文件类型
    if (!file.type.includes("image/")) {
      message.error("请上传图片文件");
      return;
    }

    isUploading.value = true;

    try {
      // 只提供必要的简单参数，避免复杂对象序列化问题
      const response = await upload(
        {
          type: "BLOG_COVER", // 只保留简单的类型参数
        },
        file
      );

      if (response.data?.code === 0 && response.data?.data) {
        coverUrl.value = response.data.data;
        message.success("图片上传成功");
      } else {
        message.error("图片上传失败");
      }
    } catch (error) {
      console.error("图片上传出错:", error);
      message.error("图片上传失败");
    } finally {
      isUploading.value = false;
    }
  };

  const handleUploadImage2 = async (event: any, insertImage: any, files: any) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // 检查文件类型
    if (!file.type.includes("image/")) {
      message.error("请上传图片文件");
      return;
    }

    isUploading.value = true;

    try {
      // 只提供必要的简单参数，避免复杂对象序列化问题
      const response = await upload(
        {
          type: "BLOG_COVER", // 只保留简单的类型参数
        },
        file
      );

      if (response.data?.code === 0 && response.data?.data) {
        const url = response.data.data;
        console.log(url);
        insertImage({
          url: url,
          width: "auto",
          height: "auto",
        });
        message.success("图片上传成功");
      } else {
        message.error("图片上传失败");
      }
    } catch (error) {
      console.error("图片上传出错:", error);
      message.error("图片上传失败");
    } finally {
      isUploading.value = false;
    }
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
    });
  };

  // 取消操作
  const handleCancel = () => {
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
      await deleteTag({ id: tagId });
      tags.value = tags.value.filter((tag) => tag.id !== tagId);
      // 如果删除的标签正在被选中，也从选择中移除
      tagIds.value = tagIds.value.filter(id => id !== tagId);
      message.success("标签删除成功");
    } catch (error) {
      message.error("标签删除失败");
    }
  };

  // 删除分类
  const deleteCategoryFunction = async (id: number | undefined) => {
    if (id === undefined) return;
    
    try {
      await deleteCategory({ id });
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
  const initArticleData = (id: number, data: any) => {
    articleId.value = id;
    title.value = data.title || '';
    content.value = data.content || '';
    summary.value = data.summary || '';
    categoryId.value = data.categoryId;
    tagIds.value = data.tagIds || [];
    status.value = data.status || 1;
    coverUrl.value = data.coverUrl || '';
    
    // 如果有分类名称和标签名称，预先处理选择项
    const categoryName = data.categoryName;
    const tagNamesList = data.tagNames || [];
    
    // 当分类和标签数据加载完成后，设置正确的显示
    if (categoryName && categories.value.length > 0) {
      // 如果找不到对应的分类ID，但有分类名称，则创建一个临时分类
      if (!categories.value.some(c => c.id === categoryId.value)) {
        console.log(`未找到ID为${categoryId.value}的分类，使用名称${categoryName}进行展示`);
        // 这里不添加到categories，只是为了UI展示，实际提交时仍使用服务器的分类ID
      }
    }
    
    if (tagNamesList.length > 0 && tagIds.value.length > 0 && tags.value.length > 0) {
      // 如果有标签ID和名称，但在现有标签中找不到，先展示这些名称
      console.log(`设置标签展示，标签ID:${tagIds.value.join(',')}, 标签名称:${tagNamesList.join(',')}`);
    }
    
    // 展开内容编辑区
    contentExpanded.value = true;
    // 确保表单可见
    formVisible.value = true;
    // 立即激活所有动画
    Object.keys(animations).forEach(key => {
      animations[key] = true;
    });
  };

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
    newTagName,
    showTagForm,
    isLoadingTags,
    isAddingTag,
    addNewTag,

    // 图片上传相关
    isUploading,
    handleImageUpload,
    handleUploadImage2,
    removeCoverImage,

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
    initArticleData,
  };
}
