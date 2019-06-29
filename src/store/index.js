import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  // state 中的数据可以被任何组件访问
  // 在组件中直接 this.$store.state.xxx 进行访问
  state: {
    user: getUser() || {}
  },
  mutations: {
    changeUser (state, user) {
      // 将参数 user 合并到 state.user 中，在此更改后的信息把本地存储中的信息覆盖
      Object.assign(state.user, user)
      // 将程序中最新的用户信息重新写入本地存储，防止刷新得到旧的本地存储中的用户信息
      setUser(state.user)
    }
  }
})
export default store
