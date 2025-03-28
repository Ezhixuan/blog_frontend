import request from "@/utils/request";

/**
 * 使用AI生成博客内容简述
 * @param title 博客标题
 * @returns 生成的内容简述
 */
export async function generateBlogContent(title: string) {
  return request<API.BaseResponseString>("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { title },
  });
}

// 由于后端可能还没有实现AI生成接口，这里提供一个模拟实现
// 实际项目中应该删除这个函数，使用上面的真实API
export async function mockGenerateBlogContent(title: string) {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 根据标题生成简单的内容
  const content = `# ${title}

## 引言
在这篇博客中，我们将探讨${title}相关的内容。

## 主要内容
${title}是一个非常有趣的话题，它涉及到许多方面的知识。

### 关键点1
这是关于${title}的第一个关键点。

### 关键点2
这是关于${title}的第二个关键点。

## 总结
通过本文的介绍，我们对${title}有了更深入的了解。希望这篇文章对你有所帮助！

---
*这是由AI自动生成的内容简述，请根据实际需要修改完善。*`;
  
  return {
    data: {
      code: 0,
      data: content,
      description: "生成成功"
    }
  };
}