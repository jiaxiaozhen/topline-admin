import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import router from './router'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'
// 引入vuex
import store from './store'

// 配置 axios 的基础路径
// 发请求的时候就不需要每次都写 http://xxxx
// 例如我要请求登录，直接 axios({ url: '/authorizations' })
// 路径最后的 /，多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 如何解决后端返回数据中的数字超出安全整数范围问题？
// 可以理解成也是一个响应拦截器，这个比较特殊。这里的 data 是后端返回的未经处理的原始数据
// axios 默认使用 JONS.parse 去转换原始数据，如果其中有超出安全整数范围的数据就有问题了，所以我们在这里可以手动处理这个原始数据
//   npm i json-biginit
//   JSONbig.parse(原始json格式字符串)
// 配置处理axios返回的结果（axios 预留的自定义处理后端返回的原始数据）
axios.defaults.transformResponse = [function (data) {
  // Do whatever you want to transform the data
  try {
    // 如果是json数据
    return JSONbig.parse(data)
  } catch (err) {
    // 如果不是json数据
    return data
  }
}]

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
  store,
  render: h => h(App)
}).$mount('#app')
