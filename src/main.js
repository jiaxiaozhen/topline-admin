import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import router from './router'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'

// 配置 axios 的基础路径
// 发请求的时候就不需要每次都写 http://xxxx
// 例如我要请求登录，直接 axios({ url: '/authorizations' })
// 路径最后的 /，多退少补
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 请求前要做的事
  if (getUser()) {
    config.headers.Authorization = `Bearer ${getUser().token}`
  }
  return config // 允许请求的开关，config 是本次请求相关的配置对象
}, function (error) {
  return Promise.reject(error)
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应的数据进行操作，请求成功（200-400的状态码）
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, function (error) {
  // 请求失败的操作>400的状态码
  // 如果用户 token 无效，让其跳转到登录页面
  if (error.response.status === 401) {
    console.log(error)
    removeUser()
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)

// 将axios加到vue原型中，每个组件都是Vue的实例
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
