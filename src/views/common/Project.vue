<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 transition-all duration-500 relative overflow-hidden">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- 渐变圆形装饰 -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <!-- 网格背景 -->
      <div class="absolute inset-0 opacity-30 dark:opacity-10">
        <div class="absolute inset-0" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(148, 163, 184, 0.1) 35px, rgba(148, 163, 184, 0.1) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(148, 163, 184, 0.1) 35px, rgba(148, 163, 184, 0.1) 36px);"></div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- 页面标题 -->
      <div class="mb-12 text-center">
        <div class="flex flex-col items-center space-y-4">
          <!-- 装饰性图标 -->
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-slow">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>

          <div class="space-y-2">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent animate-fade-in-up">
              Projects
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed">
              ✨ 精心打造的项目作品集，展示各种技术栈的实践应用
            </p>
          </div>

          <!-- 管理员添加项目按钮 -->
          <div v-if="isAdmin" class="animate-fade-in-up-delayed-2">
            <button
              @click="openCreateModal"
              class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span class="relative z-10">添加项目</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 筛选和排序 - Glass Morphism 效果 -->
      <div class="mb-12 animate-fade-in-up-delayed-3">
        <div class="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/50">
          <div class="flex flex-wrap gap-6 items-center">
            <!-- 技术栈筛选 -->
            <div class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">技术栈</label>
                <select
                  v-model="selectedTechnology"
                  @change="handleFilterChange"
                  class="px-4 py-2 bg-white/90 dark:bg-slate-700/90 text-slate-900 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="">全部</option>
                  <option v-for="tech in availableTechnologies" :key="tech" :value="tech">
                    {{ tech }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 显示精选 -->
            <div class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">精选</label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    v-model="showFeaturedOnly"
                    @change="handleFilterChange"
                    type="checkbox"
                    class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  />
                  <span class="text-sm text-slate-700 dark:text-slate-300">仅显示精选项目</span>
                </label>
              </div>
            </div>

            <!-- 管理员批量操作 -->
            <div v-if="isAdmin && selectedProjects.length > 0" class="flex items-center gap-3 ml-auto animate-bounce-in">
              <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30">
                <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  已选择 {{ selectedProjects.length }} 个项目
                </span>
                <div class="flex gap-2">
                  <button
                    @click="batchSetFeatured(true)"
                    class="px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    批量推荐
                  </button>
                  <button
                    @click="batchSetFeatured(false)"
                    class="px-3 py-1 text-sm bg-gradient-to-r from-slate-400 to-slate-600 text-white rounded-lg hover:from-slate-500 hover:to-slate-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    取消推荐
                  </button>
                  <button
                    @click="batchDelete"
                    class="px-3 py-1 text-sm bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    批量删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-spin"></div>
          <div class="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl animate-ping opacity-20"></div>
        </div>
        <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 animate-pulse">
          加载中...
        </p>
      </div>

      <!-- 项目列表 -->
      <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :is-admin="isAdmin"
          :is-selected="selectedProjects.includes(project.id)"
          @toggle-select="toggleProjectSelection"
          @edit="openEditModal"
          @delete="handleDeleteProject"
          @toggle-featured="handleToggleFeatured"
          @view="handleViewProject"
          :class="`animate-fade-in-up`"
          :style="`animation-delay: ${index * 0.1}s`"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-24 text-center">
        <div class="relative mb-8">
          <div class="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center shadow-2xl">
            <svg class="w-16 h-16 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
        </div>
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            还没有项目哦 🎯
          </h3>
          <p v-if="!isAdmin" class="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            懒狗博主怎么没项目,让他提交!
          </p>
          <button
            v-if="isAdmin"
            @click="openCreateModal"
            class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <svg class="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="relative z-10">创建第一个项目</span>
          </button>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-16 flex justify-center">
        <nav class="flex items-center gap-2 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-white/20 dark:border-slate-700/50">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            上一页
          </button>

          <span
            v-for="page in pageNumbers"
            :key="page"
            class="px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105"
            :class="page === currentPage
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md'"
            @click="goToPage(page)"
          >
            {{ page }}
          </span>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>

    <!-- 项目编辑/创建模态框 -->
    <ProjectEditModal
      v-if="showEditModal"
      :project="editingProject"
      :is-creating="isCreating"
      @close="closeEditModal"
      @save="handleSaveProject"
    />

    <!-- 删除确认模态框 -->
    <ConfirmModal
      v-if="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      :confirmText="'删除'"
      :cancelText="'取消'"
      :confirmClass="'bg-red-600 hover:bg-red-700'"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProjectCard from '@/components/business/Blog/ProjectCard.vue'
import ProjectEditModal from '@/components/ui/Modal/ProjectEditModal.vue'
import ConfirmModal from '@/components/ui/Modal/ConfirmModal.vue'
import { projectApi } from '@/api/modules'
import { useUserStore } from '@/stores/user'
import { ProjectQueryDTO, ProjectQueryVO, ProjectCreateDTO, ProjectEditDTO } from "@/types"
import messageService from '@/utils/helpers/message'  

// 用户store
const userStore = useUserStore()

// 响应式数据
const projects = ref<ProjectQueryVO[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(12)

// 筛选和排序
const selectedTechnology = ref('')
const showFeaturedOnly = ref(false)

// 可用技术栈
const availableTechnologies = ref<string[]>([])

// 管理员功能
const selectedProjects = ref<string[]>([])
const showEditModal = ref(false)
const editingProject = ref<ProjectQueryVO | null>(null)
const isCreating = ref(false)

// 删除确认模态框
const showDeleteModal = ref(false)
const deleteModalTitle = ref('')
const deleteModalMessage = ref('')
const deleteAction = ref<(() => Promise<void>) | null>(null)

// 计算属性
const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

const pageNumbers = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 获取项目列表
const fetchProjects = async () => {
  loading.value = true
  try {
    const params: ProjectQueryDTO = {
      current: currentPage.value,
      pageSize: pageSize.value,
      featured: showFeaturedOnly.value == false ? undefined : showFeaturedOnly.value,
      technology: selectedTechnology.value,
      sortOrder: 'desc'
    }

    const response = await projectApi.getProjects(params)
    projects.value = response.data.data
    totalPages.value = Math.ceil(response.data.total / pageSize.value)

    // 提取所有技术栈
    const techSet = new Set<string>()
    projects.value.forEach((project: ProjectQueryVO) => {
      project.technologies.forEach((tech: string) => techSet.add(tech))
    })
    availableTechnologies.value = Array.from(techSet).sort()

  } catch (error) {
    console.error('获取项目列表失败:', error)
    messageService.error('获取项目列表失败')
  } finally {
    loading.value = false
  }
}

// 处理筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
  selectedProjects.value = []
  fetchProjects()
}

// 跳转到指定页
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProjects()
  }
}

// 项目选择
const toggleProjectSelection = (projectId: string) => {
  const index = selectedProjects.value.indexOf(projectId)
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(projectId)
  }
}

// 打开创建模态框
const openCreateModal = () => {
  editingProject.value = null
  isCreating.value = true
  showEditModal.value = true
}

// 打开编辑模态框
const openEditModal = (project: ProjectQueryVO) => {
  editingProject.value = project
  isCreating.value = false
  showEditModal.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  showEditModal.value = false
  editingProject.value = null
  isCreating.value = false
}

// 保存项目
const handleSaveProject = async (projectData: ProjectCreateDTO | ProjectEditDTO) => {
  try {
    if (isCreating.value) {
      await projectApi.createProject(projectData as ProjectCreateDTO)
      messageService.success('项目创建成功')
    } else {
      // 编辑时需要携带id
      const editData = {
        ...projectData,
        id: editingProject.value!.id
      } as ProjectEditDTO
      await projectApi.updateProject(editData)
      messageService.success('项目更新成功')
    }
    closeEditModal()
    fetchProjects()
  } catch (error) {
    console.error('保存项目失败:', error)
    messageService.error('保存项目失败')
  }
}

// 删除项目
const handleDeleteProject = (project: ProjectQueryVO) => {
  deleteModalTitle.value = '删除项目'
  deleteModalMessage.value = `确定要删除项目 "${project.title}" 吗？此操作不可撤销。`
  deleteAction.value = async () => {
    await projectApi.deleteProject(project.id)
    messageService.success('项目删除成功')
    fetchProjects()
  }
  showDeleteModal.value = true
}

// 切换推荐状态
const handleToggleFeatured = async (project: ProjectQueryVO) => {
  try {
    await projectApi.doFeatured(project.id)
    messageService.success(`项目${project.featured ? '取消推荐' : '推荐'}成功`)
    fetchProjects()
  } catch (error) {
    console.error('更新推荐状态失败:', error)
    messageService.error('更新推荐状态失败')
  }
}

// 查看项目
const handleViewProject = async (project: ProjectQueryVO) => {
  try {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank')
    }
  } catch (error) {
    console.error('增加浏览量失败:', error)
  }
}

// 批量设置推荐状态
const batchSetFeatured = async (featured: boolean) => {
  try {
    await Promise.all(
      selectedProjects.value.map(id => 
        projectApi.updateProject({ id, featured })
      )
    )
    messageService.success(`批量${featured ? '推荐' : '取消推荐'}成功`)
    selectedProjects.value = []
    fetchProjects()
  } catch (error) {
    console.error('批量操作失败:', error)
    messageService.error('批量操作失败')
  }
}

// 批量删除
const batchDelete = () => {
  deleteModalTitle.value = '批量删除项目'
  deleteModalMessage.value = `确定要删除选中的 ${selectedProjects.value.length} 个项目吗？此操作不可撤销。`
  deleteAction.value = async () => {
    await Promise.all(
      selectedProjects.value.map(id => projectApi.deleteProject(id))
    )
    messageService.success('批量删除成功')
    selectedProjects.value = []
    fetchProjects()
  }
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (deleteAction.value) {
    try {
      await deleteAction.value()
    } catch (error) {
      console.error('删除失败:', error)
      messageService.error('删除失败')
    }
  }
  cancelDelete()
}

// 取消删除
const cancelDelete = () => {
  showDeleteModal.value = false
  deleteAction.value = null
}

// 页面加载时获取数据
onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
/* 现代化动画效果 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up-delayed {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up-delayed-2 {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up-delayed-3 {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in-up-delayed {
  animation: fade-in-up-delayed 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-up-delayed-2 {
  animation: fade-in-up-delayed-2 0.6s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-in-up-delayed-3 {
  animation: fade-in-up-delayed-3 0.6s ease-out 0.6s forwards;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* 悬停效果 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
}
</style>
