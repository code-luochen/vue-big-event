
// 基于axios封装网络请求的函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
 export const baseURL = 'http://big-event-vue-api-t.itheima.net'
// axios.create()创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址是baseURL+url，然后去请请求后台
const myAxios = axios.create({
    baseURL: baseURL
})
// 请求拦截器
myAxios.interceptors.request.use((config) => {
    // 请求前会触发一次
        if (store.state.token) {
            config.headers.Authorization = store.state.token
        }
    return config
}, (err) => {
    // 请求失败的一个回调函数
    return Promise.reject(err)
})
// 响应拦截器
myAxios.interceptors.response.use((response) => {
    // 响应码为2xx或3xx时触发成功的回调，形参中的response是"成功的结果"
    return response
}, (err) => {
    // 响应码不是2xx时触发失败的回调
    if (err.response.status === 401) {
        // 证明token值过期，需要将vuex中的值清空，然后求换到登录的页面（被动退出登录状态）
        store.commit('updateToken', '')
        store.commit('updateUserInfo', {})
        router.push('/login')
        Message.error('用户身份已过期，请重新登录！！')
        }
        return Promise.reject(err)
})

// 导出axios自定义函数
export default myAxios
