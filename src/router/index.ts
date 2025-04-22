import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Blogs from '../views/Blogs.vue'
import Project from '../views/Project.vue'
import Friend from '../views/Friend.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import BlogEdit from '../views/BlogEdit.vue'

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
      component: () => import('../views/ArticleDetail.vue')
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
    }
  ]
})

// 添加全局前置守卫，用于调试路由跳转
router.beforeEach((to, from) => {
  // 路由守卫保留基本功能，但移除调试日志
  return true; // 必须返回true以允许路由继续
});

export default router