import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [

    {
        path: '/',
        component: () => import('@/views/layout'),
        redirect: 'home',
        children: [
            {
                // 侧边栏导航，点击会切换路由地址，路由地址靠数据请求回来铺设上去的
                // 所以你的路由规则要和他保持一致
                 path: 'home',
                 component: () => import('@/views/home')
        },
        // 用户信息路由
        {
             path: 'user-info',
            //  如果引入文件包的话，他会找到包自动找包中的index文件，如果没有，就要写全
            component: () => import('@/views/User/userInfo.vue')
        },
        // 更换头像路由
        {
          path: 'user-avatar',
          component: () => import('@/views/User/userAvatar.vue')
        },
        // 修改密码路由
        {
          path: 'user-pwd',
          component: () => import('@/views/User/userPwd.vue')
        },
        // 文章分类路由
        {
          path: 'art-cate',
          component: () => import('@/views/article/artCate.vue')
        },
        // 文章列表路由
        {
          path: 'art-list',
          component: () => import('@/views/article/artList.vue')
        }

        ]
    },
    {
        path: '/reg',
        // webpack 提供import函数来路由懒加载
        // 路由懒加载，就是页面路由路径切换到/reg后才去加载对应的组件代码
        // 好处：让首页加载更快，体积更小
        component: () => import('@/views/register')
    },
    {
        path: '/login',
        component: () => import('@/views/login')
    }
]

const router = new VueRouter({
    routes
})

// 全局前置路由守卫
// 只要是有路由的使用，就会调用路由守卫
// next()如果强制切换路由地址，会再次走路由守卫去匹配路由表
// 设置白名单，不需要登录就可以去的页面
// 无需验证token的页面
const whiteList = ['/login', '/reg']

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 如果有token, 证明已登录
    if (!store.state.userInfo.username) {
      // 有token但是没有用户信息, 才去请求用户信息保存到vuex里
      // 调用actions里方法请求数据
      store.dispatch('initUserInfo')
      // 下次切换页面vuex里有用户信息数据就不会重复请求用户信息
    }
    next() // 路由放行
  } else {
    // 如果无token
    // 如果去的是白名单页面, 则放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果其他页面请强制拦截并跳转到登录页面
      next('/login')
    }
  }
})
export default router

// 退出登录，重新登录，只走相关的代码（异步dom切换，不会导致所有的代码重新执行，App.vue不走）
// 当我们切换路由时，只会加载相关页面的代码，不会刷新其他页面的代码
// 效果不对：当换账号时，得重新请求用户的数据
// 解决：
// 1、可以在登录的页面，登录成功后，再发请求去拿用户的信息
// 2、可以在全局前置路由守卫中，写（路由跳转的时候，判断+获取）
