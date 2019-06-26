import Vue from 'vue'
import Router from 'vue-router'
import Nprogress from 'nprogress'
import { getUser } from '@/utils/auth'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  Nprogress.start()
  const userInfo = getUser()
  if (to.path !== '/login') {
    if (userInfo) {
      next()
    } else {
      if (from.path === '/login') {
        Nprogress.done()
      }
      next({
        path: '/login'
      })
    }
  } else {
    if (userInfo) {
      next(false)
    } else {
      next()
    }
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  Nprogress.done()
})
export default router
