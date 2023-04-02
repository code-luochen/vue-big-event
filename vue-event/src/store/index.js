import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// 导入axios
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 用户token
    userInfo: {} // 定义用户信息对象
  },
  mutations: {
    // 更新 token 的 mutation 函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户的信息
    updateUserInfo (state, info) {
      state.userInfo = info
    },
    // 更新用户头像
    updateUserAvatar (state, val) {
      state.userInfo.user_pic = val
    }
  },
  actions: {
    // 定义初始化用户基本信息的 action 函数
    async initUserInfo (store) {
      const { data: res } = await getUserInfoAPI()
      if (res.code === 0) {
        store.commit('updateUserInfo', res.data)
      }
    }
  },
  getters: {
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
// vuex 是将值保存到内存中的，所以刷新后的值会回归到初始化（无法做到持久存储）
// 借助第三方的插件，实现token值的持续化存储  vuex-persistedstate@3.x 版本的是配合vue2使用，新版配合vue3使用
// 具体步骤  下包 yarn add vuex-persistedstate@3.2.1
// 在vuex中引入import createPersistedState from 'vuex-persistedstate'
// 在代码下方配置使用功能插件，固定写法 pulgins:[createPersistedState()]
// 我们也可以使用localstorage.setitem这种方法来写，但是需要一个一个写不方便
