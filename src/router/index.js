import Vue from 'vue'
import Router from 'vue-router'
import Nprogress from 'nprogress'

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
          path: 'publish',
          component: () => import('@/views/publish')
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
router.beforeEach((to, from, next) => {
  Nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  if (to.path !== '/login') {
    if (userInfo) {
      next()
    } else {
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
router.afterEach((to, from) => {
  Nprogress.done()
})
export default router
