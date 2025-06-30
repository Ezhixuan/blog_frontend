import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/common/Home.vue'
import About from '@/views/common/About.vue'
import Blogs from '@/views/blog/Blogs.vue'
import Project from '@/views/common/Project.vue'
import Friend from '@/views/common/Friend.vue'
import Contact from '@/views/common/Contact.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import BlogEdit from '@/views/blog/BlogEdit.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/blogs',
      name: 'Blogs',
      component: Blogs
    },
    {
      path: '/project',
      name: 'Project',
      component: Project
    },
    {
      path: '/friend',
      name: 'Friend',
      component: Friend
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: () => import('@/views/blog/ArticleDetail.vue')
    },
    {
      path: '/blog/edit',
      name: 'BlogEdit',
      component: BlogEdit
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/memory',
      name: 'Memory',
      component: () => import('@/views/memo/Card.vue')
    },
    {
      path: '/websocket-test',
      name: 'WebSocketTest',
      component: () => import('@/components/business/User/WebSocketDemo.vue')
    }
  ]
})

// 添加全局前置守卫，用于调试路由跳转
router.beforeEach(() => {
  // 路由守卫保留基本功能，但移除调试日志
  return true; // 必须返回true以允许路由继续
});

export default router